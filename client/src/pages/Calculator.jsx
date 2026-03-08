import { useState } from "react";
import FundSelector from "../components/FundSelector";
import InvestmentForm from "../components/InvestmentForm";
import ResultsDisplay from "../components/ResultsDisplay/ResultsDisplay";
import { MOCK_RESULT } from "../data/mockData";

export default function Calculator() {
  const [ticker, setTicker] = useState("");
  const [investment, setInvestment] = useState("");
  const [duration, setDuration] = useState("5");
  const [result, setResult] = useState(null);

  // snapshot of inputs at the moment calculate results button was last clicked
  const [snapshot, setSnapshot] = useState(null);

  const canCalculate = ticker && investment && duration;

  const handleCalculate = () => {
    // Freeze the current inputs so ResultsDisplay doesn't react to future edits unless button is pressed again
    setSnapshot({ ticker, investment, duration });

    // TODO: Replace with real API call to /future-value
    setResult(MOCK_RESULT);
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

        {/* Results*/}
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
