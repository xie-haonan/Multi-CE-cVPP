# SE-LCA 可视化展示（Showcase）

本目录为 **Multi-CE-cVPP** 公开展示仓库中的 **静态网页**：用图表呈现与私有核心库 `src/selca/demo.py` **同口径、同输入** 的预计算结果快照，适用于企业路演与技术合作洽谈（**不含**可执行内核与完整因子表）。

## 内容物

| 文件 | 说明 |
|------|------|
| `index.html` | 展示页入口 |
| `styles.css` | 版式与主题样式 |
| `app.js` | 读取 JSON、渲染 Chart.js |
| `snapshot/selca_demo_snapshot.json` | 算例聚合快照（由私有仓库一次性导出；目录名避免与根 `.gitignore` 的 `data/` 冲突） |

## 本地预览

**请勿**直接用浏览器打开 `file://` 路径（`fetch` 受 CORS 限制会失败）。在项目根目录或本目录下启动静态服务：

```bash
cd showcase/selca
python3 -m http.server 8765
```

浏览器访问：<http://localhost:8765>

## 更新快照数据（维护者）

在已克隆的 **Multi-CE-cVPP-Core** 私有仓库中执行（需 `uv`）：

```bash
cd /path/to/Multi-CE-cVPP-Core
uv run python <<'PY'
# 与 demo 相同：calculate_selca_process_from_system_inputs + build_selca_downstream_payload
# 并将 per_equipment / construction / energy / pollutants / equivalent 导出为 JSON
# （可将 Core 内一次性脚本固定为 scripts/export_selca_showcase.py 再调用）
PY
```

将生成的 JSON 覆盖本目录 `snapshot/selca_demo_snapshot.json` 后，在本仓库提交并推送。

## GitHub Pages

若仓库启用 GitHub Pages 且站点根目录为仓库根 URL，本页路径一般为：

`https://<org>.github.io/<repo>/showcase/selca/`

若将站点根设为 `docs/`，则需将本 showcase 复制或迁移到 `docs/` 下，或改用 Actions 部署 `showcase/selca` 为子路径（按组织策略二选一）。

## 合规

展示数据为 **课题算例快照**；不替代环境合规披露或投资尽调。方法学框架引用见页面底部 ISO 14040/14044 链接。
