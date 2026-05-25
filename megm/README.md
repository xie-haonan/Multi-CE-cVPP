# MEGM 可视化展示（Showcase）

与私有核心库 **`src/megm/demo.py`** 同口径的 **预计算 JSON 快照** + 静态图表页；适用于企业展示与合作洽谈（**不含**可执行内核与完整 YAML）。

## 本地预览

```bash
cd showcase/megm
./serve.sh
```

浏览器打开终端提示的地址（默认端口 **8766**，避免与 SELCA 本地端口冲突）。勿使用 `file://`。

## 更新快照（维护者）

在 **Multi-CE-cVPP-Core** 根目录执行（需 `uv`），将打印的 JSON 写入本目录 `snapshot/megm_demo_snapshot.json`（可将下列逻辑固化为 Core 内脚本）：

```bash
uv run python …  # 与 demo 相同计算链，导出 build_megm_showcase_snapshot 结构
```

推送前请运行 **`./scripts/sync_megm_pages_folder.sh`**，使仓库根 **`megm/`** 与 `showcase/megm` 一致，从而 **`https://<user>.github.io/<repo>/megm/`** 在「从分支发布」模式下可用。

## GitHub Pages

- **推荐对外链接：** `https://xie-haonan.github.io/Multi-CE-cVPP/megm/`
- 与 SELCA 相同：若使用 **GitHub Actions** 发布，见根目录工作流；**Source 与分支发布二选一**。

## 合规

算例系数与价格为 **展示快照**；政策披露须在私有配置中绑定官方出处。
