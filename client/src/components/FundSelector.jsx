import { useState, useEffect, useContext } from "react";
import { getFunds } from "../services/api";
import { ThemeContext } from "../App";
import FundTooltip from "./FundTooltip";
import { FundListSkeleton } from "./Skeleton";

export default function FundSelector({ selected, onSelect }) {
  const { dark } = useContext(ThemeContext);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFunds()
      .then((data) => setFunds(data))
      .catch(() => setFunds([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mb-6">
        <label className={`block text-sm mb-2 ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>Mutual Fund</label>
        <FundListSkeleton rows={1} />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className={`block text-sm mb-2 ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
        Mutual Fund
      </label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className={`w-full border px-4 py-3 rounded-lg focus:outline-none transition-colors ${
          dark
            ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#d4d8dd] focus:border-[#4A90D9] focus:ring-1 focus:ring-[#4A90D9]"
            : "bg-gs-white border-gs-border text-gs-text focus:border-gs-navy focus:ring-1 focus:ring-gs-navy"
        }`}
      >
        <option value="">Select a mutual fund</option>
        {funds.map((fund) => (
          <option key={fund.symbol} value={fund.symbol}>
            {fund.symbol} — {fund.fund_name}
          </option>
        ))}
      </select>
      {selected && (
        <div className="mt-1">
          <FundTooltip ticker={selected} dark={dark}>
            <span className={`text-xs cursor-help border-b border-dashed ${dark ? "text-[#4A90D9] border-[#4A90D9]" : "text-gs-blue border-gs-blue"}`}>
              ℹ Fund info
            </span>
          </FundTooltip>
        </div>
      )}
    </div>
  );
}
