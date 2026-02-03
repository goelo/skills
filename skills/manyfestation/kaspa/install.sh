#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required but not found."
  exit 1
fi

# Ensure pip exists (some minimal python builds omit it)
if ! python3 -m pip --version >/dev/null 2>&1; then
  echo "pip not found; trying python3 -m ensurepip..."
  python3 -m ensurepip --upgrade || {
    echo "Failed to bootstrap pip (ensurepip unavailable)."
    exit 1
  }
fi

DEPS_DIR="$ROOT_DIR/.pydeps"
mkdir -p "$DEPS_DIR"

echo "Installing dependencies into $DEPS_DIR (no sudo, no venv)..."
python3 -m pip install -U pip
python3 -m pip install -U --target "$DEPS_DIR" kaspa

chmod +x "$ROOT_DIR/kaswallet.sh"
echo "Installed kaswallet.sh CLI."
echo "Next: ./kaswallet.sh --help"
