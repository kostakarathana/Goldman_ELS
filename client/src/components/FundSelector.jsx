import { MOCK_FUNDS } from "../data/mockData";

export default function FundSelector({ selected, onSelect }) {
  return (
    <div className="mb-6">
      <label className="block text-sm text-gs-dark-gray mb-2">
        Mutual Fund
      </label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full border border-gs-border bg-gs-white text-gs-text px-4 py-3 rounded-lg focus:outline-none focus:border-gs-navy focus:ring-1 focus:ring-gs-navy transition-colors"
      >
        <option value="">Select a mutual fund</option>
        {MOCK_FUNDS.map((fund) => (
          <option key={fund.ticker} value={fund.ticker}>
            {fund.ticker} — {fund.fundName}
          </option>
        ))}
      </select>
    </div>
  );
}
