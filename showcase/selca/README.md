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

**请勿**用浏览器直接打开 `index.html` 的 `file://` 路径：页面里的 `fetch('./snapshot/...')` 会被浏览器拦截，表现为**白屏或一直转圈**。

### 方式一（推荐）：一键脚本

```bash
cd /path/to/Multi-CE-cVPP/showcase/selca
./serve.sh
```

浏览器打开终端里打印的地址：**<http://127.0.0.1:8765/>**（建议用 `127.0.0.1`，与 `localhost` 等价，但有时解析差异更少）。

端口被占用时换端口：

```bash
./serve.sh 9000
# 然后打开 http://127.0.0.1:9000/
```

### 方式二：手动启动（必须在 `showcase/selca` 目录内）

```bash
cd showcase/selca
python3 -m http.server 8765 --bind 127.0.0.1
```

若你在**仓库根目录** `Multi-CE-cVPP/` 启动了 `python3 -m http.server 8765`，根目录下没有 `index.html`，直接打开 `http://127.0.0.1:8765/` 会不对；此时请打开：

**<http://127.0.0.1:8765/showcase/selca/>**

### 仍打不开时请自检

1. 终端里是否**先**启动了上述命令，且进程在运行（关掉终端会停服）。
2. `python3` 是否存在：macOS 上常见为 `python3` 而非 `python`。
3. 端口是否被占用：`lsof -i :8765`（可换 `./serve.sh 9000`）。
4. 浏览器是否误打成 **https**（本地一般为 **http**）。
5. 若页面能打开但图表空白：打开开发者工具 (F12) → **Console**，看是否有 `snapshot/selca_demo_snapshot.json` 404（说明当前 URL 路径与静态根不一致，请按上面「在 selca 目录启动」或「根目录 + /showcase/selca/」修正）。

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

## GitHub Pages（公网访问，不依赖本机）

可以。与 [个人主页 `https://xie-haonan.github.io/`](https://xie-haonan.github.io/) 类似，均由 **GitHub Pages** 托管静态文件；区别在于：

| 类型 | 典型仓库名 | 访问地址 |
|------|------------|----------|
| **用户/组织站** | `xie-haonan.github.io` | `https://xie-haonan.github.io/`（仓库根即网站根） |
| **项目站**（本仓库） | `Multi-CE-cVPP` | `https://<你的用户名>.github.io/Multi-CE-cVPP/` |

本仓库已提供 **GitHub Actions** 工作流 [`.github/workflows/deploy-selca-pages.yml`](../../.github/workflows/deploy-selca-pages.yml)：把 `showcase/selca` 整目录作为 **网站根** 发布，因此上线后 **项目站首页就是 SELCA 大屏**（无需再敲 `/showcase/selca/`）。

### 一次性设置（在 GitHub 网页上操作）

1. 打开仓库 **Settings → Pages**。
2. **Build and deployment** 里 **Source** 选 **GitHub Actions**（不要选「Deploy from a branch」除非你改用 `docs/` 方案）。
3. 将工作流与 `showcase/selca` 推送到 **`main`**；在 **Actions** 里确认 **Deploy SELCA showcase to GitHub Pages** 成功。
4. 浏览器访问：**`https://<你的 GitHub 用户名>.github.io/Multi-CE-cVPP/`**（首次可能要等 1～2 分钟）。

若 Pages 里出现 **Configure** 环境权限提示，按 GitHub 提示为 `github-pages` 环境放行一次即可。

### 若希望网址完全是 `https://xie-haonan.github.io/` 下某一子路径

个人站仓库与项目站是两套机制：可以把本页 **链接** 挂在个人站「Projects」里指向 `https://xie-haonan.github.io/Multi-CE-cVPP/`；或另建专门展示仓库并单独开 Pages。

### 合规

公网托管的仍是 **展示快照 + 静态前端**，不含私有内核；与页脚声明一致。

## 合规

展示数据为 **课题算例快照**；不替代环境合规披露或投资尽调。方法学框架引用见页面底部 ISO 14040/14044 链接。
