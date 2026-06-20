# Tools — BiRefNet (notes for AI agents)

This directory is an **isolated Python environment for BiRefNet**, used
to generate wedding-invitation assets (background-removed RGBA PNGs).
It is not part of the Next.js / nikah-web build.

## Where to start

Read `tools/README.md` first. It explains the layout, the relocate
trick (no sudo), and the CLI.

## Things agents commonly get wrong here

* The system Python (`/usr/bin/python3`) is 3.9.6. Do **not** try to
  `pip install` into it. Use `source tools/activate-birefnet.sh` first.
* The Python framework is relocated to `tools/python_framework/`. The
  activate script sets `DYLD_FRAMEWORK_PATH` and
  `DYLD_FALLBACK_LIBRARY_PATH` so it loads without sudo. Do not try to
  symlink it into `/Library/Frameworks/`.
* BiRefNet weights are stored as **fp16**. Load the model with
  `torch_dtype=torch.float16` and cast inputs to fp16 before inference
  (see `tools/birefnet.py`). Mixing fp16 weights with fp32 inputs
  raises `RuntimeError: Input type (float) and bias type (c10::Half)`.
* BiRefNet's Swin backbone needs spatial dims divisible by 32. The CLI
  snaps resize targets to multiples of 32; if you call the model
  manually, do the same or pass `image_size = (1024, 1024)`.
* The `dynamic` variant of BiRefNet (`zhengpeng7/BiRefNet_dynamic`)
  was trained on 256²-2304² and is the best default for non-benchmark
  use. The original `BiRefNet` repo holds the **DIS (Dichotomous Image
  Segmentation) benchmark** weights — those do not produce good mattes
  on people. Don't conflate the two.
* M1 GPU (MPS) is enabled and faster than CPU for fp16 BiRefNet. Don't
  fall back to CPU unless MPS is unavailable.

## Do not commit

* `tools/venv/` — large (~2 GB), recreated by `pip install`.
* `tools/python-pkg-extract/` — intermediate workspace, recreated by
  the regen script in `tools/README.md`.
* `tools/python_framework/` — ~600 MB; keep locally, do not push.
  The `.gitignore` at the repo root does not yet exclude it — if you
  regenerate it, also add the entries listed in "Suggested .gitignore
  additions" below.

## Suggested .gitignore additions

Add the following to the root `.gitignore` (next to the existing
`nikah-web/node_modules/` entries) if you intend to commit other
changes while these tools exist:

```
# BiRefNet install (tools/)
tools/python_framework/
tools/python-pkg-extract/
tools/python-3.11.9-macos11.pkg
tools/venv/
```

The CLI script `tools/birefnet.py` and the docs (`tools/README.md`,
`tools/CLAUDE.md`, `tools/activate-birefnet.sh`, `tools/test_birefnet.py`)
**should** be committed.
