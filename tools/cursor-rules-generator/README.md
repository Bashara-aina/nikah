# Cursor Rules Generator (nikah)

> **Status:** scaffolded & wired — needs API keys to actually generate.

Fork of [sanjeed5/awesome-cursor-rules-mdc](https://github.com/sanjeed5/awesome-cursor-rules-mdc) configured for the nikah project.

It uses **Exa** (semantic web search) to gather best-practices docs, then asks an **OpenAI-compatible LLM** (configured for MiniMax M3) to write a `.mdc` rule file per library. Output goes straight into the repo's `.cursor/rules/` so Cursor picks them up automatically.

## Curated library list (`src/rules.nikah.json`)

| Library       | Tags                              |
| ------------- | --------------------------------- |
| `next-js`     | frontend, framework, react, ssr   |
| `react`       | frontend, framework, javascript   |
| `tailwind`    | ui, css, utility-first            |
| `typescript`  | language, type-checking           |
| `zod`         | validation, type-checking         |
| `gsap`        | frontend, animation, motion       |

> To add/remove a library, edit `src/rules.nikah.json` (NOT `rules.json` — that's the upstream default with 241 entries).

## Output destination

`/nikah/.cursor/rules/` — picked up by Cursor whenever you work in this repo. This is the **repo root**, so the rules will apply to `nikah-web/`, `docs/`, and `tools/` alike. If you'd rather scope them to the app only, change `output_dir` in `src/config.yaml` to `../../nikah-web/.cursor/rules`.

> ⚠️ `nikah-web/.cursor/rules/` already contains hand-written, version-pinned rules for **Next 16 / React 19** (see `nikah-web/.cursor/rules/nextjs-stack.mdc`). The generated files are a **supplement**, not a replacement. They cover general library patterns; the existing rules cover version-specific traps.

## One-time setup

```bash
# 1. Install uv (one-time, if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"

# 2. From inside this folder
cd /Users/basharaaina/Projects/nikah/tools/cursor-rules-generator

# 3. Sync deps (Python 3.11 is auto-downloaded by uv)
uv sync

# 4. Add your API keys
cp .env.nikah.example .env
# ...edit .env and add real EXA_API_KEY + OPENAI_API_KEY + OPENAI_API_BASE...
```

### Where to get the keys

| Key              | Where                                                          |
| ---------------- | -------------------------------------------------------------- |
| `EXA_API_KEY`    | [exa.ai](https://exa.ai) — free tier available                 |
| `OPENAI_API_KEY` | From your MiniMax dashboard (or any OpenAI-compatible issuer)  |
| `OPENAI_API_BASE`| `https://api.minimaxi.chat/v1` (or your provider's base URL)   |

## Usage

### From the repo root (npm scripts)

```bash
cd /Users/basharaaina/Projects/nikah/nikah-web

npm run rules:test    # 1 library (gsap — only one not yet attempted)
npm run rules:all     # all 6 curated libraries
npm run rules:regen   # re-run everything, ignore previous progress
```

### Direct invocation

```bash
cd /Users/basharaaina/Projects/nikah/tools/cursor-rules-generator

./run.sh test                    # smoke-test (1 lib)
./run.sh all                     # full curated list
./run.sh library next-js         # one specific lib
./run.sh regen                   # regenerate everything
```

Or fully manual:

```bash
uv run python src/generate_mdc_files.py --test
uv run python src/generate_mdc_files.py --library typescript
uv run python src/generate_mdc_files.py --regenerate-all
```

## CLI flags

| Flag                   | Effect                                                  |
| ---------------------- | ------------------------------------------------------- |
| `--test`               | Process one library (the first "new" one)               |
| `--library NAME`       | Process a single library by name                        |
| `--regenerate-all`     | Re-run even for libraries already marked "completed"    |
| `--output DIR`         | Override output dir                                     |
| `--workers N`          | Parallel workers (default 2)                            |
| `--rate-limit N`       | API calls per minute (default 60)                       |
| `--verbose` / `--debug`| Logging detail                                          |

## What it actually does (one library)

1. Reads `src/rules.nikah.json`, picks a library.
2. Calls **Exa** → returns top-N relevant URLs for "X best practices 2026".
3. Scrapes & chunks the pages (cached to `src/exa_results/<lib>_exa_result.json`).
4. Sends the chunks + a system prompt to **MiniMax M3** via LiteLLM.
5. Saves the returned `.mdc` to `../../.cursor/rules/`.
6. Updates `src/mdc_generation_progress.json`.

## Cost expectations

Per library, rough order of magnitude:

- 1 Exa search call (≈ $0.01) + 1 page-scrape (≈ $0.001/page × 5–10 pages).
- 1 LLM completion with ~50K input + ~3K output tokens.

For 6 libraries on a single `npm run rules:all`, expect a few cents to a dollar depending on provider pricing. Monitor with your provider dashboard.

## Troubleshooting

- **"rules.json not found at …/src/rules.nikah.json"** — the curated file was moved or deleted. Restore from git.
- **`401 Invalid API key` from Exa** — `EXA_API_KEY` is wrong or missing.
- **`401 login fail: Please carry the API secret key…`** from MiniMax — `OPENAI_API_KEY` is wrong, or `OPENAI_API_BASE` points to the wrong issuer.
- **`AuthenticationError` after retries** — same as above. The script retries 3× then logs the library as failed in `mdc_generation_progress.json`; rerun with `./run.sh` (it will skip successful ones and retry failures by default).
- **Output dir doesn't exist** — created automatically on first run, but if you see errors, `mkdir -p /Users/basharaaina/Projects/nikah/.cursor/rules`.

## Upstream reference

This is an unmodified clone of https://github.com/sanjeed5/awesome-cursor-rules-mdc, with the following nikah-specific changes:

- `src/config.yaml` — output dir, model, rate limits
- `src/rules.nikah.json` — curated 6-library list (new file)
- `.env.nikah.example` — env template with MiniMax base URL (new file)
- `run.sh` — convenience wrapper (new file)
- `README.md` — this file (replaces upstream readme in this folder)
