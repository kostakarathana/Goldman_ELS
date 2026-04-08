import { useContext, useState } from "react";
import toast from "react-hot-toast";
import FundSelector from "../components/FundSelector";
import InvestmentForm from "../components/InvestmentForm";
import ResultsDisplay from "../components/ResultsDisplay";
import { ResultsSkeleton } from "../components/Skeleton";
import { getFutureValue } from "../services/api";
import { ThemeContext } from "../App";

export default function Calculator() {
  const { dark } = useContext(ThemeContext);
  const [ticker, setTicker] = useState("");
  const [investment, setInvestment] = useState("");
  const [duration, setDuration] = useState("365");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // snapshot of inputs at the moment calculate results button was last clicked
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
      toast.success(`Projected value: ${Number(data.futureValue).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}`);
    } catch (err) {
      setError("Calculation failed. Please try again.");
      toast.error("Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-8 py-10">
      {/* Hero section */}
      <div className="text-center mb-10">
        <h1 className={`text-3xl mb-3 ${dark ? "text-[#7fb3e0]" : ""}`}>Fund Investment Calculator</h1>
        <p className={`text-base max-w-xl mx-auto leading-relaxed ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
          See how much your investment could grow over time using the Capital
          Asset Pricing Model. Select a fund, enter your investment
          details, and calculate.
        </p>
      </div>

      <div className="flex gap-10 items-start">
        {/* Calculator card */}
        <div className={`self-start rounded-xl border p-8 shadow-sm shrink-0 w-5/12 transition-colors duration-300 ${
          dark ? "bg-[#0f1a2e] border-[#1e3050]" : "bg-gs-white border-gs-border"
        }`}>
          <FundSelector selected={ticker} onSelect={setTicker} />
          <InvestmentForm
            investment={investment}
            onInvestmentChange={setInvestment}
            onDurationChange={setDuration}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            disabled={!canCalculate || loading}
            onClick={handleCalculate}
            className={`w-full py-3 px-6 text-sm font-semibold tracking-wide rounded-lg transition-all ${
              canCalculate && !loading
                ? dark
                  ? "bg-[#4A90D9] text-white hover:bg-[#3a7bc8] cursor-pointer shadow-md hover:shadow-lg"
                  : "bg-gs-navy text-gs-white hover:bg-gs-navy-dark cursor-pointer shadow-md hover:shadow-lg"
                : dark
                  ? "bg-[#1a2a3e] text-[#3a5068] cursor-not-allowed"
                  : "bg-gs-light-gray text-gs-medium-gray cursor-not-allowed"
            }`}
          >
            {loading ? "Calculating..." : "Calculate Future Value"}
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ResultsSkeleton />
          ) : (
            <ResultsDisplay
              result={result}
              ticker={snapshot?.ticker}
              investment={snapshot?.investment}
              duration={snapshot?.duration}
            />
          )}
        </div>
      </div>
    </main>
  );
}
