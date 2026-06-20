# `tools/` — BiRefNet for nikah

This directory holds a self-contained BiRefNet installation used to
generate background-removed (RGBA PNG) assets for the nikah wedding
invitation site. It was added in Jun 2026.

The tool is **not** a Next.js / nikah-web dependency — it is a one-off
asset-generation utility. It is safe to delete if you do not need to
regenerate cutouts.

## What is here

| Path | Purpose |
| --- | --- |
| `activate-birefnet.sh` | Sourceable shell init that puts the right Python and library paths on `$PATH` for the session. |
| `python_framework/` | Python 3.11.9 macOS framework, **relocated** to here so we don't need sudo. Do not move it. |
| `python-3.11.9-macos11.pkg` | The original installer we extracted. Keep for reference; not used at runtime. |
| `python-pkg-extract/` | Intermediate extraction workspace. Safe to delete. |
| `venv/` | Python 3.11 venv with `torch`, `transformers`, `timm`, `kornia`, `pillow-heif`. |
| `birefnet.py` | The CLI (`birefnet input output ...`). |
| `birefnet-mcp-server/` | MCP server exposing BiRefNet to Cursor (`list-birefnet-models`, `remove-background`, `batch-remove-background`). Wire via `.cursor/mcp.json`. |
| `image-processing-mcp-server/` | Pre-existing MCP server for resize / crop / convert (separate concern). |
| `test_birefnet.py` | One-off smoke test (single image). Not needed in production. |

## Why this layout

* The system Python is 3.9.6 — too old for BiRefNet's modern `transformers`
  pin. We downloaded the official `python-3.11.9-macos11.pkg` and
  extracted its `Python.framework` here.
* The framework is relocated to `tools/python_framework/`. The shell
  init sets `DYLD_FRAMEWORK_PATH` and `DYLD_FALLBACK_LIBRARY_PATH` so
  the relocated framework loads cleanly without touching
  `/Library/Frameworks` (no sudo).
* All Python deps live in a project-local venv at `tools/venv/`.
* The HF model weights cache lives in `~/.cache/huggingface/` (the
  default). The first run downloads ~424 MB for `BiRefNet_dynamic` and
  ~220 MB for the base `BiRefNet`; subsequent runs are local.

## Quick start

```bash
# 1. Activate the environment for this shell session.
source tools/activate-birefnet.sh

# 2. List available model variants.
python3 tools/birefnet.py --list-models

# 3. Segment a single image.
python3 tools/birefnet.py assets/_source/prewedding/DSC05174.jpg \
                          assets/couple/couple-cutout.png

# 4. Segment every image in a directory.
python3 tools/birefnet.py assets/_source/prewedding/ assets/couple/raw/
```

The CLI writes **RGBA PNGs** with the matte as the alpha channel. They
drop straight into `assets/` and are mirrored to `public/assets/` by the
existing `npm run copy-assets` script.

## Model variants

| Alias | HF repo | Default max side | When to use |
| --- | --- | --- | --- |
| `dynamic` (default) | `ZhengPeng7/BiRefNet_dynamic` | 1024 | Any-resolution, general use; trained on 256²-2304². **Best default for wedding photos.** |
| `portrait` | `ZhengPeng7/BiRefNet-portrait` | 1024 | People, especially portraits. |
| `matting` | `ZhengPeng7/BiRefNet-matting` | 1024 | Soft-edge matting (hair, fur). |
| `hr-matting` | `ZhengPeng7/BiRefNet_HR-matting` | 2048 | High-res matting on large source images. |
| `hr` | `ZhengPeng7/BiRefNet_HR` | 2048 | High-res general use. |
| `dis` | `ZhengPeng7/BiRefNet` | 1024 | Original DIS paper weights. Benchmark only; not great for human portraits. |
| `lite` | `ZhengPeng7/BiRefNet_lite` | 1024 | Smaller model, faster, lower quality. |

`hr` and `hr-matting` are 2-3× slower on M1 because the input is bigger
(~2048 max side). For prewedding photos the dynamic model at 1024
already produces clean results.

## CLI reference

```text
usage: birefnet [-h] [--model {dynamic,portrait,matting,hr-matting,hr,dis,lite}]
                [--max-side MAX_SIDE] [--list-models] [--overwrite] [--quiet]
                [input] [output]
```

* `input` — file (single) or directory (batch). Recurses one level.
* `output` — file (single) or directory (batch). For batch mode, the
  output filename is `<input-stem>.png` regardless of the source
  extension (so a `foo.jpg` becomes `foo.png`).
* `--overwrite` — by default existing outputs are skipped.
* `--quiet` — less per-image logging.
* `--max-side` — override the model's default cap.

## Performance on Mac M1

Measured on a 2024 M1 (16 GB). The model is loaded once per process
and then amortised across all images in a batch.

| Source size | Model | Inference time | Output PNG |
| --- | --- | --- | --- |
| 4000×6000 photo (prewedding) | `dynamic` | ~17 s | 21 MB RGBA |
| 2268×4032 HEIC (cat) | `dynamic` | ~20 s | 3.9 MB RGBA |
| 1536×1024 PNG (cat) | `dynamic` | 5–17 s | 2–2.8 MB RGBA |

For a 12-image prewedding batch expect ~3–4 minutes total. The base
`BiRefNet` (`dis`) is ~2× faster but produces noticeably worse mattes
on people.

## Regenerating the environment from scratch

If `tools/venv/` or `tools/python_framework/` is ever wiped:

```bash
# Re-extract Python 3.11 (only needed if tools/python_framework is gone).
cd tools
curl -fsSL -o python-3.11.9-macos11.pkg \
  https://www.python.org/ftp/python/3.11.9/python-3.11.9-macos11.pkg
xar -xf python-3.11.9-macos11.pkg -C python-pkg-extract
gunzip -c python-pkg-extract/Python_Framework.pkg/Payload \
  | cpio -idmu -D python-pkg-extract
mkdir -p python_framework
mv python-pkg-extract/Python python-framework-root
mv python-framework-root/Python.framework python_framework/
source activate-birefnet.sh
python3 -m ensurepip --upgrade   # bootstrap pip (no SSL until deps are installed)
python3 -m venv venv
source activate-birefnet.sh      # re-source to point PATH at the venv
python3 -m pip install --upgrade pip setuptools wheel
python3 -m pip install --index-url https://download.pytorch.org/whl/cpu \
                        torch torchvision
python3 -m pip install transformers timm einops Pillow kornia pillow-heif
```

## Uninstalling

Just `rm -rf tools/` and remove the BiRefNet model cache:

```bash
rm -rf tools/
rm -rf ~/.cache/huggingface/hub/models--zhengpeng7--*
```

Nothing else in the repo is touched.

## Using BiRefNet from Cursor (MCP server)

The `birefnet-mcp-server/` sub-package exposes BiRefNet to Cursor /
any MCP client. Once it is wired into `.cursor/mcp.json` (the project
already does this for `birefnet` and `image-processing`), you can ask
the agent in plain English:

* *"Remove the background from `/path/to/photo.jpg`, save to `cutout.png`."*
* *"Use the `portrait` model on the prewedding batch in `/path/in/`."*
* *"What BiRefNet models are available?"*

The agent will pick `remove-background` or `batch-remove-background`
automatically. See `birefnet-mcp-server/README.md` for the tool
catalog, env vars, and validator.
