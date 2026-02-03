#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export PYTHONPATH="$ROOT_DIR/.pydeps:${PYTHONPATH:-}"
exec python3 "$ROOT_DIR/scripts/kaswallet.py" "$@"