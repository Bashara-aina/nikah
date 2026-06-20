#!/usr/bin/env bash
# Source this file to put BiRefNet Python 3.11 on PATH.
#   source tools/activate-birefnet.sh
#
# The Python framework lives in tools/python_framework (no sudo install).
# We point DYLD_FRAMEWORK_PATH at it so the relocated framework loads,
# and we expose python3 / pip3 on PATH for the rest of the session.

# Resolve the path of this script even when sourced with a relative path.
if [[ -n "${BASH_SOURCE[0]:-}" && "${BASH_SOURCE[0]}" != /* ]]; then
  ACTIVATE_SELF="${PWD}/${BASH_SOURCE[0]}"
elif [[ -n "${BASH_SOURCE[0]:-}" ]]; then
  ACTIVATE_SELF="${BASH_SOURCE[0]}"
else
  ACTIVATE_SELF="${PWD}/tools/activate-birefnet.sh"
fi
NIKAH_ROOT="$(cd "$(dirname "$ACTIVATE_SELF")/.." && pwd)"
PY_FW="$NIKAH_ROOT/tools/python_framework"
PY_BIN="$PY_FW/Python.framework/Versions/3.11/bin"

if [[ ! -x "$PY_BIN/python3.11" ]]; then
  echo "[activate-birefnet] missing Python at $PY_BIN" >&2
  return 1 2>/dev/null || exit 1
fi

export DYLD_FRAMEWORK_PATH="$PY_FW${DYLD_FRAMEWORK_PATH:+:$DYLD_FRAMEWORK_PATH}"
# The Python framework's libssl/libcrypto are at non-standard paths after
# relocation, so add the lib dir to DYLD_FALLBACK_LIBRARY_PATH.
export DYLD_FALLBACK_LIBRARY_PATH="$PY_FW/Python.framework/Versions/3.11/lib${DYLD_FALLBACK_LIBRARY_PATH:+:$DYLD_FALLBACK_LIBRARY_PATH}"
export PYTHON3_HOME="$PY_FW/Python.framework/Versions/3.11"

# Activate the venv too (holds torch, transformers, etc.) if it exists.
VENV_BIN="$NIKAH_ROOT/tools/venv/bin"
if [[ -x "$VENV_BIN/python3" ]]; then
  VIRTUAL_ENV="$NIKAH_ROOT/tools/venv"
  export VIRTUAL_ENV
  export PATH="$VENV_BIN:$PATH"
  # Make the venv's python find the framework; copy key env vars across.
  export PYTHON3_HOME="$PY_FW/Python.framework/Versions/3.11"
  echo "[activate-birefnet] venv:   $VIRTUAL_ENV"
  echo "[activate-birefnet] python: $(python3 --version 2>&1) @ $(which python3)"
  echo "[activate-birefnet] pip:    $(python3 -m pip --version 2>&1)"
else
  export PATH="$PY_BIN:$PATH"
  echo "[activate-birefnet] python: $(python3 --version 2>&1) @ $PY_BIN"
  echo "[activate-birefnet] pip:    $(python3 -m pip --version 2>&1)"
  echo "[activate-birefnet] (no venv; create one with: python3 -m venv tools/venv)"
fi
