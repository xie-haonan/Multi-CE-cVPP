/**
 * MEGM 展示页：加载与 ``src/megm/demo.py`` 同口径的预计算快照。
 */

const CHART_COLORS = {
  energy: "#c4b5fd",
  tax: "#f472b6",
  carbon: "#34d399",
  green: "#fcd34d",
  loadE: "#38bdf8",
  loadH: "#fb923c",
  grid: "rgba(148, 163, 184, 0.12)",
};

function fmt(n, maxFrac = 2) {
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

Chart.defaults.font.family = '"DM Sans","Noto Sans SC",system-ui,sans-serif';
Chart.defaults.color = "#94a3b8";
Chart.defaults.borderColor = CHART_COLORS.grid;

function baseChartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#cbd5e1", padding: 10 } },
      tooltip: {
        callbacks: {
          label(ctx) {
            const v = ctx.parsed.y !== undefined ? ctx.parsed.y : ctx.raw;
            const l = ctx.dataset.label ? `${ctx.dataset.label}: ` : "";
            return `${l}${fmt(v, 6)}`;
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

async function loadData() {
  const res = await fetch("./snapshot/megm_demo_snapshot.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`无法加载快照: HTTP ${res.status}`);
  return res.json();
}

function renderKpis(root, data) {
  const d = data.daily_totals_usd;
  const s = data.selca_construction_summary;
  const items = [
    { label: "日净能源现货流出", value: fmt(d.energy_net_outflow, 2), unit: "USD/日" },
    { label: "日污染物税（签约）", value: fmt(d.tax_signed, 2), unit: "USD/日" },
    { label: "日碳交易（签约，正为流入）", value: fmt(d.carbon_signed, 2), unit: "USD/日" },
    { label: "日绿证（签约，正为流入）", value: fmt(d.green_cert_signed, 2), unit: "USD/日" },
    { label: "容量加权寿命", value: fmt(s.weighted_life_years, 4), unit: "年" },
    { label: "建设期总电耗（SELCA）", value: fmtCompact(s.construction_electricity_kwh), unit: "kWh" },
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

function renderCoeffBlock(container, data) {
  const c = data.coefficients;
  const et = c.energy_trading;
  const carriers = ["electricity", "heat", "cold", "natural_gas", "biomass"];
  const rows = carriers
    .map((k) => {
      const b = et[k] || {};
      return `<tr><td>${k}</td><td>${fmt(b.purchase_usd_per_unit, 4)}</td><td>${fmt(b.sell_usd_per_unit, 4)}</td><td>${b.unit || ""}</td></tr>`;
    })
    .join("");
  container.innerHTML = `
    <div class="table-wrap">
      <table class="data">
        <thead><tr><th>品种</th><th>购价</th><th>售价</th><th>单位</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p style="color:#94a3b8;font-size:0.82rem;margin-top:0.75rem">
      CET：购价 ${fmt(c.carbon_trading.purchase_usd_per_kg_co2_eq, 4)} USD/kg CO₂-eq，
      售 ${fmt(c.carbon_trading.sell_usd_per_kg_co2_eq, 4)}；
      配额强度 ${fmt(c.carbon_trading.allowance_grams_per_kwh_total_load, 2)} g/kWh（总负荷口径）。<br/>
      绿证：购 ${fmt(c.green_certificate.purchase_usd_per_kwh, 5)} USD/kWh，售 ${fmt(c.green_certificate.sell_usd_per_kwh, 5)}，
      可再生配额比 ${fmt(c.green_certificate.renewable_quota_ratio, 3)}。<br/>
      等效税 β：CO₂-eq ${fmt(c.pollutant_tax_usd_per_kg.co2_eq, 5)}、SO₂-eq ${fmt(c.pollutant_tax_usd_per_kg.so2_eq, 5)}、PM2.5-eq ${fmt(c.pollutant_tax_usd_per_kg.pm25_eq, 5)} USD/kg。
    </p>`;
}

function main() {
  loadData()
    .then((data) => {
      const kpi = document.getElementById("kpi-root");
      if (kpi) renderKpis(kpi, data);
      const coeffEl = document.getElementById("coeff-table");
      if (coeffEl) renderCoeffBlock(coeffEl, data);

      const hours = data.hourly_cashflows.map((r) => `${r.hour}:00`);
      const s24 = data.inputs.series_24h;

      new Chart(document.getElementById("chart-loads"), {
        type: "line",
        data: {
          labels: hours,
          datasets: [
            {
              label: "电负荷 kWh",
              data: s24.electricity_load_kwh,
              borderColor: CHART_COLORS.loadE,
              backgroundColor: "transparent",
              tension: 0.25,
            },
            {
              label: "热负荷 kWh",
              data: s24.heat_load_kwh,
              borderColor: CHART_COLORS.loadH,
              backgroundColor: "transparent",
              tension: 0.25,
            },
          ],
        },
        options: baseChartOptions(),
      });

      new Chart(document.getElementById("chart-cashflows"), {
        type: "line",
        data: {
          labels: hours,
          datasets: [
            {
              label: "能源现货净流出 USD",
              data: data.hourly_cashflows.map((r) => r.energy_net_outflow_usd),
              borderColor: CHART_COLORS.energy,
              tension: 0.2,
            },
            {
              label: "污染物税 USD",
              data: data.hourly_cashflows.map((r) => r.tax_signed_usd),
              borderColor: CHART_COLORS.tax,
              tension: 0.2,
            },
            {
              label: "碳交易（签约）USD",
              data: data.hourly_cashflows.map((r) => r.carbon_signed_usd),
              borderColor: CHART_COLORS.carbon,
              tension: 0.2,
            },
            {
              label: "绿证（签约）USD",
              data: data.hourly_cashflows.map((r) => r.green_cert_signed_usd),
              borderColor: CHART_COLORS.green,
              tension: 0.2,
            },
          ],
        },
        options: baseChartOptions(),
      });

      new Chart(document.getElementById("chart-co2"), {
        type: "line",
        data: {
          labels: hours,
          datasets: [
            {
              label: "逐时运行 CO₂-eq kg",
              data: data.hourly_cashflows.map((r) => r.equivalent_operational_co2_eq_kg),
              borderColor: "#94a3b8",
              tension: 0.2,
            },
            {
              label: "含建设折算小时强度 kg",
              data: data.hourly_cashflows.map((r) => r.equivalent_total_co2_eq_kg),
              borderColor: "#f87171",
              tension: 0.2,
            },
          ],
        },
        options: baseChartOptions(),
      });

      const dt = data.daily_totals_usd;
      new Chart(document.getElementById("chart-daily-bar"), {
        type: "bar",
        data: {
          labels: ["能源现货净流出", "污染物税", "碳交易(签约)", "绿证(签约)"],
          datasets: [
            {
              label: "USD / 日",
              data: [dt.energy_net_outflow, dt.tax_signed, dt.carbon_signed, dt.green_cert_signed],
              backgroundColor: [
                CHART_COLORS.energy,
                CHART_COLORS.tax,
                CHART_COLORS.carbon,
                CHART_COLORS.green,
              ],
              borderRadius: 8,
            },
          ],
        },
        options: baseChartOptions(),
      });

      const cap = data.inputs.capacities_kw;
      new Chart(document.getElementById("chart-capacity"), {
        type: "bar",
        data: {
          labels: Object.keys(cap),
          datasets: [
            {
              label: "装机 kW",
              data: Object.values(cap),
              backgroundColor: CHART_COLORS.energy,
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

      const sc = data.selca_construction_summary;
      const mat = sc.raw_material_total_kg;
      new Chart(document.getElementById("chart-materials"), {
        type: "bar",
        data: {
          labels: Object.keys(mat),
          datasets: [
            {
              label: "建设原材料 kg（无回收合计）",
              data: Object.values(mat),
              backgroundColor: "#818cf8",
              borderRadius: 6,
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
          <p style="color:#94a3b8;font-size:0.85rem;margin:0.5rem 0 0">请用本地 HTTP 服务打开本目录（勿用 file://）。</p>
        </article>`;
      }
    });
}

main();
