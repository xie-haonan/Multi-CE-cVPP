#!/usr/bin/env bash
# 在「本脚本所在目录」启动静态站，避免从错误 cwd 启动导致 404。
set -euo pipefail
cd "$(dirname "$0")"
PORT="${1:-8765}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  SE-LCA 展示页"
echo "  目录: $(pwd)"
echo "  请在浏览器打开:"
echo "    http://127.0.0.1:${PORT}/"
echo "  （若 8765 被占用，可执行: ./serve.sh 9000）"
echo "  按 Ctrl+C 停止服务"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exec python3 -m http.server "${PORT}" --bind 127.0.0.1
