#!/usr/bin/env bash
# 将 ``showcase/selca`` 同步到仓库根 ``selca/``，供「GitHub Pages → Deploy from branch」
# 的 Jekyll 构建生成 ``https://<user>.github.io/<repo>/selca/``（未启用 GitHub Actions 时）。
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
rm -rf selca
mkdir -p selca
cp -R showcase/selca/. selca/
python3 <<'PY'
from pathlib import Path
p = Path("selca/index.html")
text = p.read_text(encoding="utf-8")
if not text.lstrip().startswith("---"):
    p.write_text("---\nlayout: null\n---\n" + text, encoding="utf-8")
PY
echo "OK: synced to selca/ (remember to git add/commit)."
