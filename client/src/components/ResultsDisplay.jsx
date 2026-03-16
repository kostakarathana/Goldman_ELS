export default function ResultsDisplay({ result, ticker, investment, duration }) {
  if (!result) return null;

  const fundName = result.fundName || ticker;

  const principal = Number(investment);
  const gain = result.futureValue - principal;
  const gainPct = ((gain / principal) * 100).toFixed(1);

  const fmt = (n) =>
    Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const pct = (n) => (Number(n) * 100).toFixed(2) + "%";

  const days = Number(duration);
  const formatDuration = (d) => {
    if (d < 30) return `${d} ${d === 1 ? "day" : "days"}`;
    if (d < 365) return `${Math.round(d / 30)} ${Math.round(d / 30) === 1 ? "month" : "months"}`;
    const yrs = (d / 365).toFixed(1);
    return `${yrs} ${yrs === "1.0" ? "year" : "years"}`;
  };

  return (
    <div className="mt-10">
      {/* Section title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl mb-2">Your Investment Projection</h2>
        <p className="text-sm text-gs-dark-gray">
          {fundName} ({ticker}) over {formatDuration(days)}
        </p>
      </div>

      {/* Result cards row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Initial */}
        <div className="bg-gs-white rounded-xl border border-gs-border p-5 text-center">
          <p className="text-xs text-gs-medium-gray uppercase tracking-wider mb-2">Initial Investment</p>
          <p className="text-2xl text-gs-text font-semibold">{fmt(principal)}</p>
        </div>

        {/* Future Value — hero card */}
        <div className="bg-gs-navy rounded-xl p-5 text-center shadow-lg">
          <p className="text-xs text-gs-gold-light uppercase tracking-wider mb-2">Estimated Future Value</p>
          <p className="text-3xl text-gs-white font-bold">{fmt(result.futureValue)}</p>
          <p className="text-sm text-green-300 mt-1">+{fmt(gain)} ({gainPct}%)</p>
        </div>

        {/* Interest Earned */}
        <div className="bg-gs-success-light rounded-xl border border-green-200 p-5 text-center">
          <p className="text-xs text-gs-success uppercase tracking-wider mb-2">Interest Earned</p>
          <p className="text-2xl text-gs-success font-semibold">+{fmt(gain)}</p>
        </div>
      </div>

      {/* Details breakdown */}
      <div className="bg-gs-white rounded-xl border border-gs-border overflow-hidden">
        <div className="px-5 py-3 border-b border-gs-border">
          <p className="text-xs text-gs-medium-gray uppercase tracking-wider m-0">Calculation Details</p>
        </div>
        <div className="divide-y divide-gs-border">
          {[
            ["CAPM Rate (r)", pct(result.rate)],
            ["Beta (β)", result.beta.toFixed(4)],
            ["Expected Return", pct(result.expectedReturn)],
            ["Risk-Free Rate", pct(result.riskFreeRate)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between px-5 py-3">
              <span className="text-sm text-gs-dark-gray">{label}</span>
              <span className="text-sm font-mono text-gs-navy font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-gs-medium-gray mt-4 leading-relaxed text-center max-w-lg mx-auto">
        This calculator is for illustrative purposes only and may not apply to your individual circumstances.
        Projections are based on historical data and the Capital Asset Pricing Model. Past performance does not guarantee future results.
      </p>
    </div>
  );
}
