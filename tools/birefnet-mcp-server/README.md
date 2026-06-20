# `birefnet-mcp-server` — BiRefNet as a Cursor MCP tool

This package turns BiRefNet (the SOTA high-resolution dichotomous image
segmentation model from ZhengPeng7) into a **native Cursor tool**. With
it wired into `.cursor/mcp.json`, you can say *"remove the background
from that photo"* in chat and the agent will call one of these tools:

| Tool | Purpose |
| --- | --- |
| `list-birefnet-models` | Enumerate the 7 model variants and pick the right one. |
| `remove-background` | Segment one image → RGBA cutout PNG. |
| `batch-remove-background` | Segment every image in a directory → RGBA cutout PNGs. |

It is the MCP-server counterpart to `tools/birefnet.py` (the standalone
CLI). The server is a small TypeScript shim that shells out to the
Python CLI on every call (so the model is loaded once per call inside
the Python process). For multi-image workloads, use the batch tool —
it amortises the model load across all images in a directory.

## How it works

```
Cursor  →  JSON-RPC over stdio  →  this Node process
                                       │
                                       ├─ list-birefnet-models
                                       ├─ remove-background  ──┐
                                       └─ batch-remove-background
                                                                  │
                                                                  ▼
                                       tools/activate-birefnet.sh
                                                                  │
                                                                  ▼
                                       tools/birefnet.py (Python 3.11 + torch + transformers)
                                                                  │
                                                                  ▼
                                       HuggingFace cache (~/.cache/huggingface)
```

The Python side does all of the heavy lifting; this server is just a
thin RPC adapter with Zod-validated input schemas.

## Install

```bash
cd tools/birefnet-mcp-server
npm install
npm run build
```

## Test (mirrors the image-processing validator)

```bash
# Pre-req: tools/birefnet.py + tools/activate-birefnet.sh must be working.
# Run:    source ../../tools/activate-birefnet.sh && python3 -c "import torch" (sanity)
npm run validate
```

The validator boots the built server (`build/index.js`) over stdio just
like Cursor does, runs a structured test matrix (handshake, all tools,
edge cases, output integrity), and exits non-zero on any failure.

## Wire into Cursor

Add this server to `.cursor/mcp.json` (project-scoped) or your user
config:

```jsonc
{
  "mcpServers": {
    "birefnet": {
      "command": "node",
      "args": [
        "/Users/basharaaina/Projects/nikah/tools/birefnet-mcp-server/build/index.js"
      ]
    }
  }
}
```

Then restart Cursor. The `birefnet` server will show up in the agent's
tool palette.

## Environment variables

| Var | Default | Purpose |
| --- | --- | --- |
| `BIREFNET_PY` | `../../tools/birefnet.py` (relative to `build/index.js`) | Override the path to the Python CLI. |
| `BIREFNET_ACTIVATE` | `../../tools/activate-birefnet.sh` | Override the activate script path. |

## Why a separate package?

`tools/image-processing-mcp-server/` already exists with the same
shape. Mirroring its layout (src/index.ts, src/tools/*.ts,
src/pythonRunner.ts, validate.mjs) keeps both servers consistent for
anyone editing or extending them. The image-processing one is pure
Node + sharp; this one is Node + Python (BiRefNet) because there is no
Node equivalent of BiRefNet.
