#!/usr/bin/env bash
# 将 ``showcase/megm`` 同步到仓库根 ``megm/``（Jekyll「从分支发布」时生成 /megm/ URL）。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
rm -rf megm
mkdir -p megm
cp -R showcase/megm/. megm/
python3 <<'PY'
from pathlib import Path
p = Path("megm/index.html")
text = p.read_text(encoding="utf-8")
if not text.lstrip().startswith("---"):
    p.write_text("---\nlayout: null\n---\n" + text, encoding="utf-8")
PY
echo "OK: synced to megm/"
