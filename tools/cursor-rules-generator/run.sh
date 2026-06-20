#!/usr/bin/env bash
# =====================================================================
#  generate-rules.sh — wrapper for awesome-cursor-rules-mdc (nikah)
# =====================================================================
#  Usage:
#      ./generate-rules.sh test                # smoke-test, 1 library
#      ./generate-rules.sh all                 # generate all 6 libraries
#      ./generate-rules.sh library next-js     # generate one library
#      ./generate-rules.sh regen               # regenerate all
# =====================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Ensure uv is on PATH (installed by astral installer).
export PATH="$HOME/.local/bin:$PATH"

# Load .env (don't overwrite pre-existing env vars).
if [ ! -f ".env" ]; then
  echo "[generate-rules] .env not found. Copying .env.nikah.example to .env."
  echo "[generate-rules] Edit .env and add real EXA_API_KEY + OPENAI_API_KEY first."
  cp .env.nikah.example .env
  echo "[generate-rules] .env created. Aborting — fill in keys and re-run."
  exit 1
fi

# shellcheck disable=SC1091
set -a; source .env; set +a

CMD=(uv run python src/generate_mdc_files.py)

case "${1:-test}" in
  test)        CMD+=(--test) ;;
  all)         CMD+=() ;;                          # processes all in rules.nikah.json
  library)     CMD+=(--library "${2:?usage: library <name>}") ;;
  regen)       CMD+=(--regenerate-all) ;;
  *)           echo "Unknown command: $1"; exit 2 ;;
esac

echo "[generate-rules] Running: ${CMD[*]}"
exec "${CMD[@]}"
