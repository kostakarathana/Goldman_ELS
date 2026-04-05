import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const fmt = (n) =>
  Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const pct = (n) => (Number(n) * 100).toFixed(2) + "%";

function buildGrowthData(principal, rate, totalDays) {
  const totalYears = totalDays / 365;
  const points = 40;
  const data = [];
  for (let i = 0; i <= points; i++) {
    const years = (i / points) * totalYears;
    const days = Math.round(years * 365);
    const label =
      days < 30
        ? `${days}d`
        : days < 365
        ? `${Math.round(days / 30)}mo`
        : `${(days / 365).toFixed(1)}yr`;
    data.push({
      label,
      value: Math.round(principal * Math.pow(1 + rate, years)),
    });
  }
  return data;
}

function buildWhatIfData(principal, rate) {
  const horizons = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30];
  return horizons.map((yr) => ({
    label: `${yr}yr`,
    value: Math.round(principal * Math.pow(1 + rate, yr)),
  }));
}

const tooltipStyle = {
  contentStyle: { background: "#fff", border: "1px solid #D9D5CC", borderRadius: 8, fontSize: 12 },
  formatter: (val) => [fmt(val), "Value"],
};

export default function ResultsDisplay({ result, ticker, investment, duration }) {
  if (!result) return null;

  const fundName = result.fundName || ticker;
  const principal = Number(investment);
  const gain = result.futureValue - principal;
  const gainPct = ((gain / principal) * 100).toFixed(1);
  const days = Number(duration);

  const formatDuration = (d) => {
    if (d < 30) return `${d} ${d === 1 ? "day" : "days"}`;
    if (d < 365) return `${Math.round(d / 30)} ${Math.round(d / 30) === 1 ? "month" : "months"}`;
    const yrs = (d / 365).toFixed(1);
    return `${yrs} ${yrs === "1.0" ? "year" : "years"}`;
  };

  const growthData = buildGrowthData(principal, result.rate, days);
  const whatIfData = buildWhatIfData(principal, result.rate);

  const detailRows = [
    ["CAPM Rate (r)", pct(result.rate)],
    ["Beta (β)", result.beta != null ? result.beta.toFixed(4) : "0 (no market correlation)"],
    ["Expected Return", pct(result.expectedReturn)],
    ["Risk-Free Rate", pct(result.riskFreeRate)],
  ];

  return (
    <div className="mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl mb-2">Your Investment Projection</h2>
        <p className="text-sm text-gs-dark-gray">
          {fundName} ({ticker}) over {formatDuration(days)}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gs-white rounded-xl border border-gs-border p-5 text-center">
          <p className="text-xs text-gs-medium-gray uppercase tracking-wider mb-2">Initial Investment</p>
          <p className="text-2xl text-gs-text font-semibold">{fmt(principal)}</p>
        </div>
        <div className="bg-gs-navy rounded-xl p-5 text-center shadow-lg">
          <p className="text-xs text-gs-gold-light uppercase tracking-wider mb-2">Estimated Future Value</p>
          <p className="text-3xl text-gs-white font-bold">{fmt(result.futureValue)}</p>
          <p className="text-sm text-green-300 mt-1">+{fmt(gain)} ({gainPct}%)</p>
        </div>
        <div className="bg-gs-success-light rounded-xl border border-green-200 p-5 text-center">
          <p className="text-xs text-gs-success uppercase tracking-wider mb-2">Interest Earned</p>
          <p className="text-2xl text-gs-success font-semibold">+{fmt(gain)}</p>
        </div>
      </div>

      {/* Growth chart */}
      <div className="bg-gs-white rounded-xl border border-gs-border p-6 mb-6">
        <h3 className="text-base font-semibold text-gs-navy mb-4">Investment Growth Over Time</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={growthData} margin={{ top: 4, right: 16, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEDEB" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#B0ADA5" }} interval="preserveStartEnd" />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: "#B0ADA5" }}
              width={48}
            />
            <Tooltip {...tooltipStyle} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#1A3B5C"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#1A3B5C" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* What if simulator */}
      <div className="bg-gs-white rounded-xl border border-gs-border p-6 mb-6">
        <h3 className="text-base font-semibold text-gs-navy mb-1">What If Simulator</h3>
        <p className="text-xs text-gs-medium-gray mb-4">Same fund & investment across different time horizons</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={whatIfData} margin={{ top: 4, right: 16, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDEDEB" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#B0ADA5" }} />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: "#B0ADA5" }}
              width={48}
            />
            <Tooltip {...tooltipStyle} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#B89D5A"
              strokeWidth={2}
              dot={{ r: 3, fill: "#B89D5A" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Calculation details */}
      <div className="bg-gs-white rounded-xl border border-gs-border overflow-hidden">
        <div className="px-5 py-3 border-b border-gs-border">
          <p className="text-xs text-gs-medium-gray uppercase tracking-wider m-0">Calculation Details</p>
        </div>
        <div className="divide-y divide-gs-border">
          {detailRows.map(([label, value]) => (
            <div key={label} className="flex justify-between px-5 py-3">
              <span className="text-sm text-gs-dark-gray">{label}</span>
              <span className="text-sm font-mono text-gs-navy font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-gs-medium-gray mt-4 leading-relaxed text-center max-w-lg mx-auto">
        This calculator is for illustrative purposes only and may not apply to your individual circumstances.
        Projections are based on historical data and the Capital Asset Pricing Model. Past performance does not guarantee future results.
      </p>
    </div>
  );
}
