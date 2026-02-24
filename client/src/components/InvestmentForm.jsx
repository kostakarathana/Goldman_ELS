export default function InvestmentForm({ investment, duration, onInvestmentChange, onDurationChange }) {
  const years = Number(duration) || 1;

  return (
    <div className="space-y-6 mb-6">
      {/* Investment amount */}
      <div>
        <label className="block text-sm text-gs-dark-gray mb-2">
          Initial Investment
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gs-medium-gray text-lg">$</span>
          <input
            type="number"
            min="0"
            step="100"
            placeholder="10,000"
            value={investment}
            onChange={(e) => onInvestmentChange(e.target.value)}
            className="w-full border border-gs-border bg-gs-white text-gs-text pl-9 pr-4 py-3 rounded-lg focus:outline-none focus:border-gs-navy focus:ring-1 focus:ring-gs-navy transition-colors text-lg"
          />
        </div>
      </div>

      {/* Duration slider */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label className="text-sm text-gs-dark-gray">
            Investment Duration
          </label>
          <span className="text-lg font-semibold text-gs-navy">
            {years} {years === 1 ? "Year" : "Years"}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          value={years}
          onChange={(e) => onDurationChange(e.target.value)}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gs-medium-gray mt-1">
          <span>1 Yr</span>
          <span>10 Yr</span>
          <span>20 Yr</span>
          <span>30 Yr</span>
        </div>
      </div>
    </div>
  );
}
