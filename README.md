# Multi-CE-cVPP

面向社区级多能流系统的公开展示仓库（Showcase Edition）。

> This repository is a **public technical showcase**.  
> It presents architecture, assumptions, and interface contracts only.  
> Production-grade algorithms and operational datasets are maintained in a separate private core repository.

## 愿景与定位

Multi-CE-cVPP 旨在构建一个可扩展、可审计、可解释的多能互补社区虚拟电厂框架，覆盖：

- 能源系统物理建模（电-热-冷-气耦合）
- 生命周期可持续性评估（SELCA）
- 多元绿色市场映射（电价、碳价、绿证、税费）
- 运行调度与事后绩效评价（规划中的公开接口）

本公开仓库用于展示方法学框架、接口设计与工程规范，便于国际同行、审稿人与投资方快速理解系统能力边界。

## 架构拓扑（展示版）

```text
┌──────────────────────────────────────────────────────────┐
│                  Multi-CE-cVPP Showcase                 │
├──────────────────────────────────────────────────────────┤
│  Layer 1: components   -> 物理设备层（能量转换）          │
│  Layer 2: operation    -> 运行调度层（时序决策）          │
│  Layer 3: selca        -> 生命周期量化层（环境与资源）    │
│  Layer 4: market       -> 市场交互层（电/碳/绿证/税费）   │
│  Layer 5: performance  -> 综合评价层（多指标评估）        │
├──────────────────────────────────────────────────────────┤
│  Public: docs + interfaces + figures                    │
│  Private: executable kernels + proprietary datasets      │
└──────────────────────────────────────────────────────────┘
```

## 仓库内容

- `docs/ASSUMPTIONS.md`：系统假设与物理边界
- `docs/MATHEMATICAL_BOUNDARY.md`：关键守恒方程与约束表达
- `src/interfaces/`：高维接口与占位函数（仅文档化，不含业务实现）
- `assets/figures/`：对外展示图表（请替换为你的实际成果图）
- **`showcase/selca/`** / **`https://xie-haonan.github.io/Multi-CE-cVPP/selca/`**：SE-LCA 生命周期量化展示（与私有 `src/selca/demo.py` 同口径快照）。源码在 `showcase/selca`，发布用根目录 **`selca/`** 由 [`scripts/sync_selca_pages_folder.sh`](scripts/sync_selca_pages_folder.sh) 同步。
- **`showcase/megm/`** / **`https://xie-haonan.github.io/Multi-CE-cVPP/megm/`**：MEGM 市场层展示（税、碳 CET、能源现货、绿证 GCT；与私有 `src/megm/demo.py` 同口径快照）。源码在 `showcase/megm`，发布用根目录 **`megm/`** 由 [`scripts/sync_megm_pages_folder.sh`](scripts/sync_megm_pages_folder.sh) 同步。一键同步两者：[`scripts/sync_showcase_public.sh`](scripts/sync_showcase_public.sh)。
- **GitHub Pages**：在 **Settings → Pages** 任选 **GitHub Actions**（[`.github/workflows/deploy-selca-pages.yml`](.github/workflows/deploy-selca-pages.yml) 发布门户 + `selca/` + `megm/`）或 **从分支构建（Jekyll）**；**勿混用两种 Source**。门户根：**`https://xie-haonan.github.io/Multi-CE-cVPP/`**（仓库根 [`index.html`](index.html) 为 Jekyll 用带 `layout: null`；Actions 用无头 [`showcase/github_pages_site_root_index.html`](showcase/github_pages_site_root_index.html)）。
- **挂在个人站 Projects**：可复制 [`showcase/PERSONAL_SITE_PROJECT_SNIPPETS.md`](showcase/PERSONAL_SITE_PROJECT_SNIPPETS.md) 中的 Markdown 到 **`xie-haonan.github.io`** 仓库源码。

## 展示图（Illustrative）

### 系统拓扑图
![System Topology](assets/figures/system-topology.png)

### 调度结果剖面图
![Dispatch Profile](assets/figures/dispatch-profile.png)

### 综合评价雷达图
![Performance Radar](assets/figures/performance-radar.png)

## 痛点与价值

- 面向审稿场景：提供完整方法学叙述，避免“黑盒系统”质疑
- 面向产业沟通：明确边界条件、输入输出、可验证性与可扩展性
- 面向生态协作：用接口契约对齐多方开发，降低集成风险

## 合规说明

- 本仓库不包含可直接复现实盘策略的核心实现。
- 本仓库不包含私有业务数据、敏感配置与商业机理参数。
- 如需深度合作，请通过 NDA 流程访问私有核心仓库。

## 公开边界与红线（建议审阅者先读）

- 你在本仓库看到的是 **方法学框架 + 接口契约 + 展示图表**，用于技术沟通与学术评审。
- 你在本仓库看不到 **生产可执行内核、私有参数库、业务数据资产、策略求解器实现**。
- `src/interfaces/` 中函数采用 `NotImplementedError` 作为边界声明，避免被误用为可运行系统。
- 若需可运行版本验证，请走 NDA 流程并在受控环境中审阅私有仓库。
