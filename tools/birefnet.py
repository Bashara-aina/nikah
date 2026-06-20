#!/usr/bin/env python3
"""BiRefNet CLI: foreground segmentation for wedding-invitation assets.

Usage:
    source tools/activate-birefnet.sh
    python3 tools/birefnet.py input.jpg out.png              # single file
    python3 tools/birefnet.py src_dir/ out_dir/               # batch directory
    python3 tools/birefnet.py --list-models                  # show available variants

BiRefNet takes an RGB image and returns a binary matte; we paste that as
the alpha channel of the output PNG (RGBA) so the result drops straight
into the nikah-web asset pipeline.

Default model: zhengpeng7/BiRefNet_dynamic (any-resolution general use).
This is the closest match to BiRefNet's "general use" weights from the
GitHub README and the model the project owners recommend for
non-benchmark, real-world assets.
"""

from __future__ import annotations

import argparse
import os
import sys
import time
from pathlib import Path

# Quiet HF progress bars on stderr so logs stay clean.
os.environ.setdefault("HF_HUB_DISABLE_PROGRESS_BARS", "1")

import torch  # noqa: E402
from PIL import Image  # noqa: E402

# Register HEIC/HEIF opener with PIL before we touch any image.
try:
    from pillow_heif import register_heif_opener  # noqa: E402

    register_heif_opener()
except ImportError:
    pass  # HEIC support is best-effort; the rest of the tool still works.

from torchvision import transforms  # noqa: E402
from transformers import AutoModelForImageSegmentation  # noqa: E402


def log(msg: str) -> None:
    """Single-line log helper. Always goes to stderr so the MCP runner
    (and other line-oriented parsers) can rely on a single stream."""
    print(f"[birefnet] {msg}", file=sys.stderr, flush=True)


# Model registry. The first one is the default.
# Each entry: (hf_repo_id, supports_resize, recommended_input_max_side)
# `supports_resize=False` means the model was trained on dynamic shapes and
# we should pass the image through at its native resolution.
MODELS: dict[str, tuple[str, bool, int]] = {
    "dynamic": ("zhengpeng7/BiRefNet_dynamic", False, 1024),
    "portrait": ("zhengpeng7/BiRefNet-portrait", True, 1024),
    "matting": ("zhengpeng7/BiRefNet-matting", True, 1024),
    "hr-matting": ("zhengpeng7/BiRefNet_HR-matting", True, 2048),
    "hr": ("zhengpeng7/BiRefNet_HR", True, 2048),
    "dis": ("zhengpeng7/BiRefNet", True, 1024),  # original DIS (background-only benchmark)
    "lite": ("zhengpeng7/BiRefNet_lite", True, 1024),
}


def list_models() -> None:
    """Print the available model variants in a readable table."""
    print(f"{'alias':<12} {'hf repo':<40} {'max side':>9}  notes")
    print(f"{'-' * 12} {'-' * 40} {'-' * 9}  ------")
    for alias, (repo, _resize, max_side) in MODELS.items():
        note = "default — any resolution" if alias == "dynamic" else ""
        print(f"{alias:<12} {repo:<40} {max_side:>9}  {note}")


def load_model(alias: str) -> tuple[torch.nn.Module, str, bool, int]:
    """Load the requested model and return (model, repo, resize, max_side)."""
    if alias not in MODELS:
        sys.exit(
            f"unknown model '{alias}'. Choices: {', '.join(MODELS)}\n"
            f"Run with --list-models for details."
        )
    repo, resize, max_side = MODELS[alias]
    log(f"loading {repo} ...")
    t0 = time.time()
    # Weights ship as fp16 — keep the model in fp16 to match.
    model = AutoModelForImageSegmentation.from_pretrained(
        repo, trust_remote_code=True, torch_dtype=torch.float16
    )
    model.eval()
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model.to(device)
    log(f"  loaded in {time.time()-t0:.1f}s on {device} (fp16)")
    return model, repo, resize, max_side


def make_transform(max_side: int, do_resize: bool) -> transforms.Compose:
    """Return the preprocessing pipeline.

    Note: `_resize_keep_aspect` (called from `segment_one`) already handles
    the resize with the correct semantics (cap the LONGER side, snap to
    multiples of 32). The transform itself does NOT add another Resize,
    because `torchvision.transforms.Resize(int)` resizes the SHORTER side,
    which would fight the explicit resize and produce non-divisible shapes.
    The `do_resize` flag is kept for API symmetry but is no longer used.
    """
    del max_side, do_resize  # explicit no-op
    return transforms.Compose(
        [
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )


def _resize_keep_aspect(img: Image.Image, max_side: int) -> Image.Image:
    """Cap the longer side to max_side and snap both dims to a multiple of 32.

    BiRefNet's Swin backbone needs spatial dims divisible by 32. Even
    when the source is already smaller than max_side, the original
    dimensions may not satisfy that constraint (e.g. 1024x2184 → 1024
    stays divisible, but 1179x2556 → 1179 is not). Snapping to a
    multiple of 32 keeps the model happy in both cases.
    """
    w, h = img.size
    longest = max(w, h)
    if longest <= max_side:
        new_w = max(32, (w // 32) * 32)
        new_h = max(32, (h // 32) * 32)
        if (new_w, new_h) == (w, h):
            return img
        return img.resize((new_w, new_h), Image.LANCZOS)
    scale = max_side / float(longest)
    new_w = max(32, int(round(w * scale / 32.0)) * 32)
    new_h = max(32, int(round(h * scale / 32.0)) * 32)
    return img.resize((new_w, new_h), Image.LANCZOS)


def segment_one(
    model: torch.nn.Module,
    src: Path,
    dst: Path,
    transform: transforms.Compose,
    device: str,
    max_side: int,
    do_resize: bool,
) -> tuple[float, int, int]:
    """Run BiRefNet on a single image. Returns (elapsed_s, w, h)."""
    img = Image.open(src).convert("RGB")
    orig_size = img.size  # (w, h)

    # For dynamic-shape models we still cap to max_side for speed; the
    # model handles arbitrary shapes internally so this is safe.
    if do_resize:
        proc = _resize_keep_aspect(img, max_side)
    else:
        proc = _resize_keep_aspect(img, max_side)  # still cap
    proc_w, proc_h = proc.size

    t0 = time.time()
    with torch.no_grad():
        x = transform(proc).unsqueeze(0).to(device).to(torch.float16)
        preds = model(x)
    mask = preds[-1].sigmoid().cpu().squeeze().float().numpy()
    elapsed = time.time() - t0

    # Resize the matte back to the original image size and apply.
    mask_img = Image.fromarray((mask * 255).clip(0, 255).astype("uint8"))
    mask_full = mask_img.resize(orig_size, Image.BILINEAR)
    rgba = img.convert("RGBA")
    rgba.putalpha(mask_full)
    dst.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(dst, optimize=True)
    return elapsed, orig_size[0], orig_size[1]


# File extensions treated as images.
IMG_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff", ".heic"}


def iter_images(src: Path):
    if src.is_file():
        yield src
        return
    if not src.is_dir():
        sys.exit(f"input not found: {src}")
    for p in sorted(src.iterdir()):
        if p.is_file() and p.suffix.lower() in IMG_EXTS:
            yield p


def main() -> int:
    ap = argparse.ArgumentParser(
        prog="birefnet",
        description="Background removal with BiRefNet (writes RGBA PNG).",
    )
    ap.add_argument("input", nargs="?", help="input file or directory")
    ap.add_argument("output", nargs="?", help="output file or directory")
    ap.add_argument(
        "--model",
        "-m",
        default="dynamic",
        choices=list(MODELS),
        help="model variant (default: dynamic = BiRefNet_dynamic)",
    )
    ap.add_argument(
        "--max-side",
        type=int,
        default=None,
        help="cap longest side to N pixels (default: model's recommended)",
    )
    ap.add_argument("--list-models", action="store_true", help="list model variants and exit")
    ap.add_argument(
        "--overwrite",
        action="store_true",
        help="overwrite existing output files (default: skip)",
    )
    ap.add_argument(
        "--quiet", "-q", action="store_true", help="less output per image",
    )
    args = ap.parse_args()

    if args.list_models:
        list_models()
        return 0

    if not args.input or not args.output:
        ap.error("input and output are required (or use --list-models)")

    src = Path(args.input)
    dst = Path(args.output)
    model, repo, do_resize, default_max = load_model(args.model)
    max_side = args.max_side or default_max
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    transform = make_transform(max_side, do_resize)

    if src.is_file():
        if dst.is_dir() or str(dst).endswith(("/", os.sep)):
            out = dst / (src.stem + ".png")
        else:
            out = dst
        if out.exists() and not args.overwrite:
            log(f"skip (exists): {out}")
            return 0
        elapsed, w, h = segment_one(model, src, out, transform, device, max_side, do_resize)
        if not args.quiet:
            log(
                f"{src.name} ({w}x{h}) -> {out.name} in {elapsed:.2f}s "
                f"({out.stat().st_size/1024:.1f} KB)"
            )
        return 0

    # batch directory mode
    dst.mkdir(parents=True, exist_ok=True)
    images = list(iter_images(src))
    if not images:
        sys.exit(f"no images found under {src}")
    log(f"processing {len(images)} images from {src} -> {dst}")
    total_t = 0.0
    n_done = 0
    for i, p in enumerate(images, 1):
        out = dst / (p.stem + ".png")
        if out.exists() and not args.overwrite:
            if not args.quiet:
                log(f"[{i}/{len(images)}] skip {p.name}")
            continue
        try:
            elapsed, w, h = segment_one(model, p, out, transform, device, max_side, do_resize)
        except Exception as e:
            log(f"[{i}/{len(images)}] FAIL {p.name}: {e}")
            continue
        total_t += elapsed
        n_done += 1
        if not args.quiet:
            log(f"[{i}/{len(images)}] {p.name} ({w}x{h}) -> {out.name} in {elapsed:.2f}s")
    if n_done:
        log(
            f"done — {n_done}/{len(images)} images, "
            f"avg {total_t/n_done:.2f}s/image, total {total_t:.1f}s"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
