/**
 * SE-LCA 展示页：加载预计算快照并渲染 Chart.js 图表。
 * 数据与私有仓库 src/selca/demo.py 同口径；本仓库不含计算内核。
 */

const EQUIP_LABELS = {
  pv: "光伏 PV",
  gasifier: "气化炉",
  bioICE: "Bio-ICE",
  orc: "ORC",
  tss: "蓄热 TSS",
  gshp: "地源热泵 GSHP",
  ec: "电制冷 EC",
  gb: "燃气锅炉 GB",
  ess: "电储能 ESS",
};

const MATERIAL_LABELS = {
  steel: "钢材",
  aluminum: "铝",
  copper: "铜",
  pvc: "PVC",
  glass: "玻璃",
};

const POLLUTANT_LABELS = {
  co: "CO",
  co2: "CO₂",
  ch4: "CH₄",
  so2: "SO₂",
  nox: "NOx",
  pm25: "PM2.5",
};

const EQUIV_LABELS = {
  co2_eq: "CO₂-eq",
  so2_eq: "SO₂-eq",
  pm25_eq: "PM2.5-eq",
};

const CHART_COLORS = {
  primary: "#22d3ee",
  secondary: "#818cf8",
  tertiary: "#34d399",
  warn: "#fbbf24",
  muted: "#64748b",
  grid: "rgba(148, 163, 184, 0.12)",
};

function fmt(n, maxFrac = 1) {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: maxFrac,
    minimumFractionDigits: 0,
  }).format(n);
}

function fmtCompact(n) {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("zh-CN", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n);
}

function labelEq(key) {
  return EQUIP_LABELS[key] || key;
}

Chart.defaults.font.family = '"DM Sans","Noto Sans SC",system-ui,sans-serif';
Chart.defaults.color = "#94a3b8";
Chart.defaults.borderColor = CHART_COLORS.grid;
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.padding = 12;

async function loadData() {
  const res = await fetch("./snapshot/selca_demo_snapshot.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`无法加载快照: HTTP ${res.status}`);
  return res.json();
}

function renderKpis(root, data) {
  const c = data.construction;
  const e = data.energy;
  const eq = data.equivalent_emissions_kg;
  const inp = data.inputs;
  const items = [
    {
      label: "设备总投资（美元）",
      value: fmt(c.total_equipment_investment_cost_usd, 0),
      unit: "USD",
    },
    {
      label: "年化投资+运维",
      value: fmt(c.total_annualized_cost_usd, 0),
      unit: "USD/年",
    },
    {
      label: "建设期设备用电",
      value: fmtCompact(c.construction_electricity_kwh),
      unit: "kWh",
    },
    {
      label: "净购电（算例输入）",
      value: fmtCompact(inp.purchased_electricity_kwh_net),
      unit: "kWh",
    },
    {
      label: "合并购电（有回收路径）",
      value: fmtCompact(e.traditional_energy_with_recycling_kwh.purchased_electricity ?? 0),
      unit: "kWh",
    },
    {
      label: "CO₂-eq（有回收）",
      value: fmtCompact(eq.with_recycling.co2_eq ?? 0),
      unit: "kg",
    },
  ];
  root.innerHTML = items
    .map(
      (x) => `
    <article class="kpi-card">
      <div class="label">${x.label}</div>
      <div class="value">${x.value}<span class="unit"> ${x.unit}</span></div>
    </article>`
    )
    .join("");
}

function renderEquipmentTable(container, perEquipment) {
  const mats = ["steel", "aluminum", "copper", "pvc", "glass"];
  const head = [
    "设备",
    "装机 kW",
    ...mats.map((m) => MATERIAL_LABELS[m]),
    "建设用电 kWh",
  ];
  const rows = perEquipment
    .filter((r) => !r.skip)
    .map((r) => {
      const cells = mats.map((m) => fmt(r.materials_kg[m] ?? 0, 2));
      return `<tr>
        <td>${labelEq(r.equipment)}</td>
        <td>${fmt(r.capacity_kw, 2)}</td>
        ${cells.map((c) => `<td>${c}</td>`).join("")}
        <td>${fmt(r.construction_electricity_kwh ?? 0, 2)}</td>
      </tr>`;
    })
    .join("");
  container.innerHTML = `
    <table class="data">
      <thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function baseChartOptions(title) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#cbd5e1" } },
      title: title ? { display: true, text: title, color: "#e2e8f0", font: { size: 13 } } : {},
      tooltip: {
        callbacks: {
          label(ctx) {
            const v = ctx.raw;
            const l = ctx.dataset.label ? `${ctx.dataset.label}: ` : "";
            return `${l}${fmt(typeof v === "object" && v !== null ? v.y ?? v : v, 4)}`;
          },
        },
      },
    },
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { color: CHART_COLORS.grid } },
      y: { ticks: { color: "#94a3b8" }, grid: { color: CHART_COLORS.grid } },
    },
  };
}

function main() {
  loadData()
    .then((data) => {
      document.getElementById("kpi-root") && renderKpis(document.getElementById("kpi-root"), data);
      renderEquipmentTable(document.getElementById("table-equipment"), data.construction.per_equipment);

      const cap = data.inputs.equipment_capacities_kw;
      const capLabels = Object.keys(cap).map(labelEq);
      const capValues = Object.values(cap);
      new Chart(document.getElementById("chart-capacity"), {
        type: "bar",
        data: {
          labels: capLabels,
          datasets: [
            {
              label: "装机 kW",
              data: capValues,
              backgroundColor: CHART_COLORS.primary,
              borderRadius: 6,
            },
          ],
        },
        options: {
          ...baseChartOptions(),
          indexAxis: "y",
          scales: {
            x: { ticks: { color: "#94a3b8" }, grid: { color: CHART_COLORS.grid } },
            y: { ticks: { color: "#94a3b8" }, grid: { display: false } },
          },
        },
      });

      const pe = data.construction.per_equipment.filter((r) => !r.skip);
      new Chart(document.getElementById("chart-construction-elec"), {
        type: "bar",
        data: {
          labels: pe.map((r) => labelEq(r.equipment)),
          datasets: [
            {
              label: "kWh",
              data: pe.map((r) => r.construction_electricity_kwh),
              backgroundColor: CHART_COLORS.secondary,
              borderRadius: 6,
            },
          ],
        },
        options: { ...baseChartOptions(), indexAxis: "y" },
      });

      const mats = Object.keys(MATERIAL_LABELS);
      const noR = data.construction.raw_material_no_recycling_kg;
      const wiR = data.construction.raw_material_with_recycling_kg;
      new Chart(document.getElementById("chart-materials-compare"), {
        type: "bar",
        data: {
          labels: mats.map((m) => MATERIAL_LABELS[m]),
          datasets: [
            {
              label: "无回收",
              data: mats.map((m) => noR[m] ?? 0),
              backgroundColor: "#475569",
              borderRadius: 6,
            },
            {
              label: "考虑回收",
              data: mats.map((m) => wiR[m] ?? 0),
              backgroundColor: CHART_COLORS.primary,
              borderRadius: 6,
            },
          ],
        },
        options: baseChartOptions(),
      });

      new Chart(document.getElementById("chart-materials-donut"), {
        type: "doughnut",
        data: {
          labels: mats.map((m) => MATERIAL_LABELS[m]),
          datasets: [
            {
              data: mats.map((m) => wiR[m] ?? 0),
              backgroundColor: ["#64748b", "#94a3b8", "#f59e0b", "#8b5cf6", "#22d3ee"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "right" } },
        },
      });

      const en = data.energy;
      const mergedNo = en.traditional_energy_merged_kwh.purchased_electricity ?? 0;
      const mergedWi = en.traditional_energy_with_recycling_kwh.purchased_electricity ?? 0;
      new Chart(document.getElementById("chart-energy-compare"), {
        type: "bar",
        data: {
          labels: ["合并购电"],
          datasets: [
            { label: "无回收路径合并", data: [mergedNo], backgroundColor: "#475569", borderRadius: 8 },
            { label: "有回收路径合并", data: [mergedWi], backgroundColor: CHART_COLORS.primary, borderRadius: 8 },
          ],
        },
        options: baseChartOptions(),
      });

      new Chart(document.getElementById("chart-material-elec"), {
        type: "bar",
        data: {
          labels: ["材料生产耗电"],
          datasets: [
            {
              label: "无回收",
              data: [en.material_production_electricity_kwh_no_recycling],
              backgroundColor: "#475569",
              borderRadius: 8,
            },
            {
              label: "有回收",
              data: [en.material_production_electricity_kwh_with_recycling],
              backgroundColor: CHART_COLORS.tertiary,
              borderRadius: 8,
            },
          ],
        },
        options: baseChartOptions(),
      });

      const pol = data.pollutants_kg;
      const pKeys = Object.keys(POLLUTANT_LABELS);
      new Chart(document.getElementById("chart-pollutant-stack"), {
        type: "bar",
        data: {
          labels: pKeys.map((k) => POLLUTANT_LABELS[k]),
          datasets: [
            {
              label: "材料路径",
              data: pKeys.map((k) => pol.from_materials_with_recycling[k] ?? 0),
              backgroundColor: CHART_COLORS.secondary,
              borderRadius: 4,
            },
            {
              label: "能源路径",
              data: pKeys.map((k) => pol.from_energy_with_recycling[k] ?? 0),
              backgroundColor: CHART_COLORS.primary,
              borderRadius: 4,
            },
          ],
        },
        options: {
          ...baseChartOptions(),
          scales: {
            x: { stacked: true, ticks: { color: "#94a3b8" }, grid: { color: CHART_COLORS.grid } },
            y: { stacked: true, ticks: { color: "#94a3b8" }, grid: { color: CHART_COLORS.grid } },
          },
        },
      });

      new Chart(document.getElementById("chart-pollutant-compare"), {
        type: "bar",
        data: {
          labels: pKeys.map((k) => POLLUTANT_LABELS[k]),
          datasets: [
            {
              label: "合计（无回收）",
              data: pKeys.map((k) => pol.total_no_recycling[k] ?? 0),
              backgroundColor: "#475569",
              borderRadius: 4,
            },
            {
              label: "合计（有回收）",
              data: pKeys.map((k) => pol.total_with_recycling[k] ?? 0),
              backgroundColor: CHART_COLORS.tertiary,
              borderRadius: 4,
            },
          ],
        },
        options: baseChartOptions(),
      });

      const ek = Object.keys(EQUIV_LABELS);
      const eq = data.equivalent_emissions_kg;
      new Chart(document.getElementById("chart-equivalent"), {
        type: "bar",
        data: {
          labels: ek.map((k) => EQUIV_LABELS[k]),
          datasets: [
            {
              label: "无回收",
              data: ek.map((k) => eq.no_recycling[k] ?? 0),
              backgroundColor: "#475569",
              borderRadius: 8,
            },
            {
              label: "有回收",
              data: ek.map((k) => eq.with_recycling[k] ?? 0),
              backgroundColor: CHART_COLORS.warn,
              borderRadius: 8,
            },
          ],
        },
        options: baseChartOptions(),
      });
    })
    .catch((err) => {
      console.error(err);
      const root = document.getElementById("kpi-root");
      if (root) {
        root.innerHTML = `<article class="kpi-card" style="grid-column:1/-1;border-color:#f87171">
          <div class="label">加载失败</div>
          <div class="value" style="font-size:1rem">${err.message}</div>
          <p style="color:#94a3b8;font-size:0.85rem;margin:0.5rem 0 0">请使用本地 HTTP 服务打开本目录（不可直接用 file:// 打开），参见页脚说明。</p>
        </article>`;
      }
    });
}

main();
