import { useState, useEffect } from "react";
import { getFunds, compareFunds } from "../services/api";
import InvestmentForm from "../components/InvestmentForm";

export default function Compare() {
  const [funds, setFunds] = useState([]);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [investment, setInvestment] = useState("");
  const [duration, setDuration] = useState("365");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFunds()
      .then(setFunds)
      .catch(() => setFunds([]));
  }, []);

  const toggleTicker = (symbol) => {
    setSelectedTickers((prev) =>
      prev.includes(symbol) ? prev.filter((t) => t !== symbol) : [...prev, symbol]
    );
  };

  const canCompare = selectedTickers.length >= 2 && investment && duration;

  const handleCompare = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await compareFunds(selectedTickers, investment, duration);
      setResults(data);
    } catch {
      setError("Comparison failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) =>
    Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const pct = (n) => (Number(n) * 100).toFixed(2) + "%";

  const days = Number(duration);
  const formatDuration = (d) => {
    if (d < 30) return `${d} day${d === 1 ? "" : "s"}`;
    if (d < 365) return `${Math.round(d / 30)} month${Math.round(d / 30) === 1 ? "" : "s"}`;
    const yrs = (d / 365).toFixed(1);
    return `${yrs} year${yrs === "1.0" ? "" : "s"}`;
  };

  const best = results?.filter((r) => !r.error).sort((a, b) => b.futureValue - a.futureValue)[0];

  return (
    <main className="max-w-7xl mx-auto px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl mb-3">Compare Funds</h1>
        <p className="text-base text-gs-dark-gray max-w-xl mx-auto leading-relaxed">
          Select two or more funds to compare their projected growth side by side using CAPM.
        </p>
      </div>

      <div className="flex gap-10 items-start">
        {/* Left card */}
        <div className="self-start bg-gs-white rounded-xl border border-gs-border p-8 shadow-sm shrink-0 w-5/12">
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <label className="block text-sm text-gs-dark-gray">Select Funds <span className="text-gs-medium-gray">(2 or more)</span></label>
              <span className="text-xs text-gs-medium-gray">{selectedTickers.length} selected</span>
            </div>
            <div className="border border-gs-border rounded-lg overflow-y-auto max-h-48">
              {funds.map((fund) => {
                const checked = selectedTickers.includes(fund.symbol);
                return (
                  <label
                    key={fund.symbol}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm border-b last:border-b-0 border-gs-light-gray ${
                      checked ? "bg-gs-navy/5" : "hover:bg-gs-light-gray"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTicker(fund.symbol)}
                      className="accent-gs-navy w-4 h-4 shrink-0"
                    />
                    <span className="font-mono text-xs text-gs-navy w-12 shrink-0">{fund.symbol}</span>
                    <span className="text-gs-dark-gray truncate">{fund.fund_name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <InvestmentForm
            investment={investment}
            duration={duration}
            onInvestmentChange={setInvestment}
            onDurationChange={setDuration}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            disabled={!canCompare || loading}
            onClick={handleCompare}
            className={`w-full py-3 px-6 text-sm font-semibold tracking-wide rounded-lg transition-all ${
              canCompare && !loading
                ? "bg-gs-navy text-gs-white hover:bg-gs-navy-dark cursor-pointer shadow-md hover:shadow-lg"
                : "bg-gs-light-gray text-gs-medium-gray cursor-not-allowed"
            }`}
          >
            {loading ? "Comparing..." : "Compare Funds"}
          </button>
        </div>

        {/* Right: results */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="text-center py-20 text-gs-medium-gray">
              <p className="text-lg">Fetching data for {selectedTickers.length} funds...</p>
            </div>
          )}

          {results && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl mb-1">Comparison Results</h2>
                <p className="text-sm text-gs-dark-gray">{fmt(Number(investment))} over {formatDuration(days)}</p>
              </div>

              <div className="grid gap-4">
                {results.map((r) => {
                  const isTop = r.ticker === best?.ticker;
                  if (r.error) {
                    return (
                      <div key={r.ticker} className="bg-gs-white rounded-xl border border-gs-border p-5 opacity-60">
                        <p className="text-sm font-mono text-gs-navy font-semibold">{r.ticker}</p>
                        <p className="text-sm text-red-400 mt-1">{r.error}</p>
                      </div>
                    );
                  }
                  const gain = r.futureValue != null ? r.futureValue - Number(investment) : null;
                  const gainPct = gain != null ? ((gain / Number(investment)) * 100).toFixed(1) : null;
                  return (
                    <div
                      key={r.ticker}
                      className={`rounded-xl border p-5 ${
                        isTop ? "bg-gs-navy border-gs-navy text-gs-white" : "bg-gs-white border-gs-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono text-sm font-bold ${isTop ? "text-gs-gold-light" : "text-gs-navy"}`}>
                            {r.ticker}
                          </span>
                          {isTop && (
                            <span className="text-xs bg-gs-gold/20 text-gs-gold-light px-2 py-0.5 rounded-full">
                              Best Return
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${isTop ? "text-gs-white" : "text-gs-text"}`}>
                            {r.futureValue != null ? fmt(r.futureValue) : "N/A"}
                          </p>
                          {gain != null && (
                            <p className={`text-sm ${isTop ? "text-green-300" : "text-gs-success"}`}>
                              +{fmt(gain)} ({gainPct}%)
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`grid grid-cols-3 gap-4 text-xs ${isTop ? "text-gs-gold-light/80" : "text-gs-medium-gray"}`}>
                        {[
                          ["CAPM Rate", r.rate != null ? pct(r.rate) : "N/A"],
                          ["Beta", r.beta != null ? r.beta.toFixed(4) : "N/A"],
                          ["Exp. Return", r.expectedReturn != null ? pct(r.expectedReturn) : "N/A"],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="uppercase tracking-wider mb-1">{label}</p>
                            <p className={`font-mono font-semibold text-sm ${isTop ? "text-gs-white" : "text-gs-navy"}`}>
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-gs-medium-gray mt-4 leading-relaxed text-center max-w-lg mx-auto">
                Projections are based on CAPM using historical beta and expected returns. Past performance does not guarantee future results.
              </p>
            </div>
          )}

          {!loading && !results && (
            <div className="text-center py-20 text-gs-medium-gray">
              <p className="text-lg mb-2">No comparison yet</p>
              <p className="text-sm">Select at least 2 funds and enter your investment to get started.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
