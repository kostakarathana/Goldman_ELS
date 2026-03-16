import { useState } from "react";
import FundSelector from "../components/FundSelector";
import InvestmentForm from "../components/InvestmentForm";
import ResultsDisplay from "../components/ResultsDisplay";
import { getFutureValue } from "../services/api";

export default function Calculator() {
  const [ticker, setTicker] = useState("");
  const [investment, setInvestment] = useState("");
  const [duration, setDuration] = useState("5");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // snapshot of inputs at the moment calculate results button was last clicked
  const [snapshot, setSnapshot] = useState(null);

  const canCalculate = ticker && investment && duration;

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setSnapshot({ ticker, investment, duration });
    try {
      const data = await getFutureValue(ticker, investment, duration);
      setResult(data);
    } catch (err) {
      setError("Calculation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-8 py-10">
      {/* Hero section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl mb-3">Mutual Fund Investment Calculator</h1>
        <p className="text-base text-gs-dark-gray max-w-xl mx-auto leading-relaxed">
          See how much your investment could grow over time using the Capital
          Asset Pricing Model. Select a mutual fund, enter your investment
          details, and calculate.
        </p>
      </div>

      <div className="flex gap-10 items-start">
        {/* Calculator card */}
        <div className="self-start bg-gs-white rounded-xl border border-gs-border p-8 shadow-sm shrink-0 w-5/12">
          <FundSelector selected={ticker} onSelect={setTicker} />
          <InvestmentForm
            investment={investment}
            duration={duration}
            onInvestmentChange={setInvestment}
            onDurationChange={setDuration}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            disabled={!canCalculate || loading}
            onClick={handleCalculate}
            className={`w-full py-3 px-6 text-sm font-semibold tracking-wide rounded-lg transition-all ${
              canCalculate && !loading
                ? "bg-gs-navy text-gs-white hover:bg-gs-navy-dark cursor-pointer shadow-md hover:shadow-lg"
                : "bg-gs-light-gray text-gs-medium-gray cursor-not-allowed"
            }`}
          >
            {loading ? "Calculating..." : "Calculate Future Value"}
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <ResultsDisplay
            result={result}
            ticker={snapshot?.ticker}
            investment={snapshot?.investment}
            duration={snapshot?.duration}
          />
        </div>
      </div>
    </main>
  );
}
