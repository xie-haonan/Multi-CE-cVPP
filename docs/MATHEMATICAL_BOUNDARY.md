# MATHEMATICAL BOUNDARY

本文件给出展示仓库采用的核心数学边界与符号约定（不含私有算法实现）。

## 1. 电功率平衡

`P_gen(t) + P_grid_import(t) - P_grid_export(t) - P_load(t) - P_aux(t) = 0`

其中：

- `P_gen(t)`：站内发电总功率
- `P_aux(t)`：站内辅助系统耗电

## 2. 热功率平衡

`Q_supply(t) - Q_demand(t) - Q_loss(t) = 0`

## 3. 碳成本映射（示例边界）

`C_carbon(t) = max(0, E_actual(t) - E_allowance(t)) * pi_carbon(t)`

## 4. 多目标优化的一般形式

`min J = w1 * J_economic + w2 * J_emission + w3 * J_resilience`

约束集合（示例）：

- 设备容量约束：`0 <= x_i(t) <= x_i,max`
- 爬坡约束：`|x_i(t)-x_i(t-1)| <= r_i,max`
- 市场交易限额：`0 <= q_market,k(t) <= q_market,k,max`

## 5. 数值求解说明

- 若问题可线性化，优先使用 MILP 求解路径
- 若包含非线性热力学关系，应提供局部凸化或分段线性化策略
- 所有公开接口应说明可行域、输入单位、输出单位与异常返回约定
