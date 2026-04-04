import { useState } from "react";
import FundSelector from "../components/FundSelector";
import InvestmentForm from "../components/InvestmentForm";
import ResultsDisplay from "../components/ResultsDisplay/ResultsDisplay";
import { getFutureValue } from "../services/api";

function ComparisonCalculator({ title }) {
  const [ticker, setTicker] = useState("");
  const [investment, setInvestment] = useState("");
  const [duration, setDuration] = useState("5");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snapshot, setSnapshot] = useState(null);

  const canCalculate = ticker && investment && duration;

  const handleCalculate = async () => {
    const requestSnapshot = { ticker, investment, duration };

    setLoading(true);
    setError(null);
    try {
      const data = await getFutureValue(ticker, investment, duration);
      setSnapshot(requestSnapshot);
      setResult(data);
    } catch (err) {
      setError("Calculation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gs-white rounded-xl border border-gs-border p-6 shadow-sm">
      <h2 className="text-2xl mb-5">{title}</h2>

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

      <div className="mt-6">
        <ResultsDisplay
          result={result}
          ticker={snapshot?.ticker}
          investment={snapshot?.investment}
          duration={snapshot?.duration}
        />
      </div>
    </section>
  );
}

export default function Compare() {
  return (
    <main className="max-w-7xl mx-auto px-8 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl mb-3">Compare Funds</h1>
        <p className="text-base text-gs-dark-gray leading-relaxed max-w-2xl mx-auto">
    
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <ComparisonCalculator title="Option 1" />
        <ComparisonCalculator title="Option 2" />
      </div>
    </main>
  );
}
