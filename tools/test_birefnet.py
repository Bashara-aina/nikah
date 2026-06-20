"""Quick smoke test: run BiRefNet on one image and save the matte.

This is a one-off sanity check used during install verification.
It is NOT the user-facing CLI (see tools/birefnet.py for that).
"""

import sys
import time
from pathlib import Path

import torch
from PIL import Image
from transformers import AutoModelForImageSegmentation
from torchvision import transforms


def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(
        "/Users/basharaaina/Projects/nikah/assets/_source/prewedding/DSC05174.jpg"
    )
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(
        "/Users/basharaaina/Projects/nikah/tools/test_birefnet_matte.png"
    )

    if not src.is_file():
        print(f"missing input: {src}", file=sys.stderr)
        return 2

    print(f"loading BiRefNet_dynamic (zhengpeng7/BiRefNet_dynamic)...", flush=True)
    t0 = time.time()
    # Weights ship as fp16 — keep the model in fp16 to match.
    dtype = torch.float16
    model = AutoModelForImageSegmentation.from_pretrained(
        "zhengpeng7/BiRefNet_dynamic", trust_remote_code=True, torch_dtype=dtype
    )
    model.eval()
    device = "mps" if torch.backends.mps.is_available() else "cpu"
    model.to(device)
    print(f"  loaded in {time.time()-t0:.1f}s on {device} (fp16)", flush=True)

    print(f"reading {src} ({src.stat().st_size/1024:.1f} KB)...", flush=True)
    img = Image.open(src).convert("RGB")
    print(f"  size: {img.size}", flush=True)

    # 1024x1024 is BiRefNet's native training resolution; BiRefNet_dynamic
    # is robust to other sizes but we still cap at 1024 max side for speed.
    max_side = 1024
    transform = transforms.Compose(
        [
            transforms.Resize(max_side, max_size=max_side + 1) if False else transforms.Resize(
                (min(max_side, img.height), min(max_side, img.width))
            ) if False else transforms.Resize(max_side, antialias=True),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )

    t0 = time.time()
    with torch.no_grad():
        # Input must match model dtype (fp16).
        x = transform(img).unsqueeze(0).to(device).to(dtype)
        preds = model(x)
    # BiRefNet returns a list of masks; take the first / highest-res.
    mask = preds[-1].sigmoid().cpu().squeeze().float().numpy()
    print(f"  inference in {time.time()-t0:.2f}s on {device}", flush=True)

    # Compose: paste the matte as alpha onto the original.
    mask_img = Image.fromarray((mask * 255).clip(0, 255).astype("uint8"))
    mask_full = mask_img.resize(img.size, Image.BILINEAR)
    rgba = img.convert("RGBA")
    rgba.putalpha(mask_full)
    dst.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(dst)
    print(f"  wrote {dst} ({dst.stat().st_size/1024:.1f} KB)", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
