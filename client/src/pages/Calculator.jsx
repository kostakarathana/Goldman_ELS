import { useState, useEffect } from "react";
import FundSelector from "../components/FundSelector";
import InvestmentForm from "../components/InvestmentForm";
import ResultsDisplay from "../components/ResultsDisplay";
import { MOCK_RESULT } from "../data/mockData";

export default function Calculator() {
  const [ticker, setTicker] = useState("");
  const [investment, setInvestment] = useState("");
  const [duration, setDuration] = useState("5");
  const [result, setResult] = useState(null);
  const [funds, setFunds] = useState([]);

  const canCalculate = ticker && investment && duration;

  useEffect(() => {
    fetch("/api/funds")
      .then((r) => r.json())
      .then(setFunds)
      .catch((err) => console.error("failed to load funds", err));
  }, []);

  const handleCalculate = () => {
    // TODO: Replace with real API call to /future-value
    setResult(MOCK_RESULT);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      {/* Hero section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl mb-3">Mutual Fund Investment Calculator</h1>
        <p className="text-base text-gs-dark-gray max-w-xl mx-auto leading-relaxed">
          See how much your investment could grow over time using the Capital Asset Pricing Model.
          Select a mutual fund, enter your investment details, and calculate.
        </p>
      </div>

      {/* Calculator card */}
      <div className="bg-gs-white rounded-xl border border-gs-border p-8 shadow-sm">
        <FundSelector selected={ticker} onSelect={setTicker} funds={funds} />
        <InvestmentForm
          investment={investment}
          duration={duration}
          onInvestmentChange={setInvestment}
          onDurationChange={setDuration}
        />

        <button
          disabled={!canCalculate}
          onClick={handleCalculate}
          className={`w-full py-3 px-6 text-sm font-semibold tracking-wide rounded-lg transition-all ${
            canCalculate
              ? "bg-gs-navy text-gs-white hover:bg-gs-navy-dark cursor-pointer shadow-md hover:shadow-lg"
              : "bg-gs-light-gray text-gs-medium-gray cursor-not-allowed"
          }`}
        >
          Calculate Future Value
        </button>
      </div>

      {/* Results */}
      <ResultsDisplay result={result} ticker={ticker} investment={investment} duration={duration} />
    </main>
  );
}
