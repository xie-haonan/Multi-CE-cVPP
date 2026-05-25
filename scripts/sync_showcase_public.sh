#!/usr/bin/env bash
# 同步所有公开展示目录到仓库根（供 GitHub Pages 分支发布）。
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/sync_selca_pages_folder.sh"
"$DIR/sync_megm_pages_folder.sh"
echo "All showcase public folders synced."
