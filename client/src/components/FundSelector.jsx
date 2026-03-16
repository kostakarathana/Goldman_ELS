import { useState, useEffect } from "react";
import { getFunds } from "../services/api";

export default function FundSelector({ selected, onSelect }) {
  const [funds, setFunds] = useState([]);

  useEffect(() => {
    getFunds()
      .then((data) => setFunds(data))
      .catch(() => setFunds([]));
  }, []);

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
        {funds.map((fund) => (
          <option key={fund.symbol} value={fund.symbol}>
            {fund.symbol} — {fund.fund_name}
          </option>
        ))}
      </select>
    </div>
  );
}
