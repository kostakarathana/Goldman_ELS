import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { getFunds, getPortfolioSuggestion } from "../services/api";
import { ThemeContext } from "../App";

function formatYears(years) {
  return `${years} ${years === 1 ? "Year" : "Years"}`;
}

const fmt = (n) =>
  Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function AllocationSection({ title, subtitle, items, accentClass, investment, dark }) {
  if (!items?.length) return null;
  const totalEstValue = items.reduce((sum, i) => sum + (i.estValue || 0), 0);
  const totalAllocated = items.reduce((sum, i) => sum + (i.pct / 100) * Number(investment), 0);
  const totalProfit = totalEstValue - totalAllocated;
  return (
    <div className={`rounded-xl border overflow-hidden ${dark ? "bg-[#0f1a2e] border-[#1e3050]" : "bg-gs-white border-gs-border"}`}>
      <div className={`${accentClass} px-6 py-4`}>
        <h3 className="text-base font-semibold text-gs-white">{title}</h3>
        <p className="text-xs text-white/70 mt-0.5">{subtitle}</p>
        {totalEstValue > 0 && (
          <div className="flex gap-6 mt-3">
            <div>
              <p className="text-xs text-white/60">Total Est. Value</p>
              <p className="text-lg font-bold text-gs-white">{fmt(totalEstValue)}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Total Profit</p>
              <p className="text-lg font-bold text-green-300">+{fmt(totalProfit)}</p>
            </div>
          </div>
        )}
      </div>
      <div className={`divide-y ${dark ? "divide-[#1e3050]" : "divide-gs-border"}`}>
        {items.map((item) => {
          const allocated = (item.pct / 100) * Number(investment);
          const profit = item.estValue ? item.estValue - allocated : null;
          return (
            <div key={item.ticker} className="px-6 py-4 flex items-start gap-4">
              <div className="shrink-0 text-center w-14">
                <p className={`text-lg font-bold ${dark ? "text-[#4A90D9]" : "text-gs-navy"}`}>{item.pct}%</p>
                <p className={`text-xs font-mono ${dark ? "text-[#5a7a96]" : "text-gs-medium-gray"}`}>{item.ticker}</p>
              </div>
              <div className="flex-1">
                <p className={`text-sm ${dark ? "text-[#d4d8dd]" : "text-gs-text"}`}>{item.rationale}</p>
                {item.estValue && (
                  <div className="flex gap-4 mt-1">
                    <p className="text-xs text-gs-success font-semibold">
                      Est. value: {fmt(item.estValue)}
                    </p>
                    {profit != null && (
                      <p className="text-xs text-gs-success font-semibold">
                        Profit: +{fmt(profit)}
                      </p>
                    )}
                    {item.rate != null && (
                      <p className={`text-xs ${dark ? "text-[#5a7a96]" : "text-gs-medium-gray"}`}>
                        CAPM rate: {item.rate}%
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const { dark } = useContext(ThemeContext);
  const [funds, setFunds] = useState([]);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [investment, setInvestment] = useState("");
  const [duration, setDuration] = useState(5);
  const [riskTolerance, setRiskTolerance] = useState(5);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getFunds()
      .then((data) => setFunds(data))
      .catch(() => setError("Unable to load the available mutual funds."));
  }, []);

  const toggleTicker = (ticker) => {
    setSelectedTickers((current) =>
      current.includes(ticker)
        ? current.filter((item) => item !== ticker)
        : [...current, ticker]
    );
  };

  const canGenerate =
    selectedTickers.length > 0 && Number(investment) > 0 && Number(duration) > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canGenerate) {
      setError("Choose at least one fund and enter a valid investment.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getPortfolioSuggestion({
        tickers: selectedTickers,
        riskTolerance: Number(riskTolerance),
        duration: Number(duration),
        investment: Number(investment),
      });

      setSuggestion(data.suggestion || "");
      toast.success("Portfolio generated successfully");
    } catch (err) {
      setSuggestion("");
      setError("Portfolio generation failed. Please try again.");
      toast.error("Portfolio generation failed");
    } finally {
      setLoading(false);
    }
  };

  const cardBg = dark ? "bg-[#0f1a2e] border-[#1e3050]" : "bg-gs-white border-gs-border";
  const inputCls = dark
    ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#d4d8dd] focus:border-[#4A90D9] focus:ring-1 focus:ring-[#4A90D9]"
    : "bg-gs-white border-gs-border text-gs-text focus:border-gs-navy focus:ring-1 focus:ring-gs-navy";

  return (
    <main className="max-w-7xl mx-auto px-8 py-10">
      <div className="text-center mb-10">
        <h1 className={`text-3xl mb-3 ${dark ? "text-[#7fb3e0]" : ""}`}>AI Portfolio Builder</h1>
        <p className={`text-base max-w-2xl mx-auto leading-relaxed ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
          Select one or more mutual funds, set your investment profile, and
          generate a portfolio suggestion.
        </p>
      </div>

      <div className="flex gap-10 items-start">
        <form
          onSubmit={handleSubmit}
          className={`self-start rounded-xl border p-8 shadow-sm shrink-0 w-5/12 transition-colors duration-300 ${cardBg}`}
        >
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <label className={`block text-sm ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
                Mutual Funds
              </label>
              <span className={`text-xs ${dark ? "text-[#4a6a86]" : "text-gs-medium-gray"}`}>
                {selectedTickers.length} selected
              </span>
            </div>
            <div className={`border rounded-lg max-h-72 overflow-y-auto ${dark ? "border-[#2a3a4e]" : "border-gs-border"}`}>
              {funds.map((fund) => (
                <label
                  key={fund.symbol}
                  className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 cursor-pointer ${
                    dark
                      ? `border-[#1e3050] hover:bg-[#111d30] ${selectedTickers.includes(fund.symbol) ? "bg-[#1a2a3e]" : ""}`
                      : `border-gs-light-gray hover:bg-gs-bg ${selectedTickers.includes(fund.symbol) ? "bg-gs-navy/5" : ""}`
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTickers.includes(fund.symbol)}
                    onChange={() => toggleTicker(fund.symbol)}
                    className="mt-1 h-4 w-4 accent-gs-navy"
                  />
                  <span className={`text-sm leading-relaxed ${dark ? "text-[#d4d8dd]" : "text-gs-text"}`}>
                    <span className="font-semibold">{fund.symbol}</span>
                    {" - "}
                    {fund.fund_name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6 mb-6">
            <div>
              <label className={`block text-sm mb-2 ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
                Total Investment
              </label>
              <div className="relative">
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg ${dark ? "text-[#4a6a86]" : "text-gs-medium-gray"}`}>
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="25,000"
                  value={investment}
                  onChange={(event) => setInvestment(event.target.value)}
                  className={`w-full border pl-9 pr-4 py-3 rounded-lg focus:outline-none transition-colors text-lg ${inputCls}`}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className={`text-sm ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
                  Investment Horizon
                </label>
                <span className={`text-lg font-semibold ${dark ? "text-[#7fb3e0]" : "text-gs-navy"}`}>
                  {formatYears(Number(duration))}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="w-full cursor-pointer"
              />
              <div className={`flex justify-between text-xs mt-1 ${dark ? "text-[#5a7a96]" : "text-gs-medium-gray"}`}>
                <span>1 Year</span>
                <span>10 Years</span>
                <span>20 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label className={`text-sm ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
                  Risk Tolerance
                </label>
                <span className={`text-lg font-semibold ${dark ? "text-[#7fb3e0]" : "text-gs-navy"}`}>
                  {riskTolerance}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={riskTolerance}
                onChange={(event) => setRiskTolerance(event.target.value)}
                className="w-full cursor-pointer"
              />
              <div className={`flex justify-between text-xs mt-1 ${dark ? "text-[#5a7a96]" : "text-gs-medium-gray"}`}>
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={!canGenerate || loading}
            className={`w-full py-3 px-6 text-sm font-semibold tracking-wide rounded-lg transition-all ${
              canGenerate && !loading
                ? dark
                  ? "bg-[#4A90D9] text-white hover:bg-[#3a7bc8] cursor-pointer shadow-md hover:shadow-lg"
                  : "bg-gs-navy text-gs-white hover:bg-gs-navy-dark cursor-pointer shadow-md hover:shadow-lg"
                : dark
                  ? "bg-[#1a2a3e] text-[#3a5068] cursor-not-allowed"
                  : "bg-gs-light-gray text-gs-medium-gray cursor-not-allowed"
            }`}
          >
            {loading ? "Generating Portfolio..." : "Generate Portfolio Suggestion"}
          </button>
        </form>

        <section className="flex-1 min-w-0">
          {loading && (
            <div className="space-y-4">
              <div className="skeleton h-48 rounded-xl" />
              <div className="skeleton h-48 rounded-xl" />
              <div className="skeleton h-24 rounded-xl" />
            </div>
          )}

          {!loading && suggestion && typeof suggestion === "object" ? (
            <div className="space-y-6">
              <AllocationSection
                title="Your Selection — Optimized"
                subtitle="AI-optimized weights for the funds you selected"
                items={suggestion.userAllocation}
                accentClass="bg-gs-navy"
                investment={investment}
                dark={dark}
              />
              <AllocationSection
                title="AI Recommended Portfolio"
                subtitle="Best picks from all available funds for your investor profile"
                items={suggestion.gptRecommendation}
                accentClass="bg-gs-gold"
                investment={investment}
                dark={dark}
              />
              {suggestion.recommendationReasoning && (
                <div className={`rounded-xl border p-5 ${cardBg}`}>
                  <p className={`text-xs uppercase tracking-wider mb-2 ${dark ? "text-[#5a7a96]" : "text-gs-medium-gray"}`}>Why this recommendation?</p>
                  <p className={`text-sm leading-relaxed ${dark ? "text-[#d4d8dd]" : "text-gs-text"}`}>{suggestion.recommendationReasoning}</p>
                </div>
              )}
            </div>
          ) : !loading && suggestion ? (
            <div className={`rounded-xl border p-6 ${cardBg}`}>
              <pre className={`whitespace-pre-wrap break-words text-sm m-0 leading-7 font-sans ${dark ? "text-[#d4d8dd]" : "text-gs-text"}`}>{suggestion}</pre>
            </div>
          ) : !loading ? (
            <div className={`rounded-xl border border-dashed p-8 text-sm leading-7 text-center ${
              dark ? "border-[#2a3a4e] text-[#4a6a86]" : "border-gs-border text-gs-medium-gray"
            }`}>
              Generate a portfolio suggestion to see the recommended allocation and rationale here.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
