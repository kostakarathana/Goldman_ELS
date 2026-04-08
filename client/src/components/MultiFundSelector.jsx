import { useState, useEffect, useContext } from "react";
import { getFunds } from "../services/api";
import { ThemeContext } from "../App";
import FundTooltip from "./FundTooltip";

export default function MultiFundSelector({ selectedTickers, onToggleTicker, label = "Select Funds" }) {
  const { dark } = useContext(ThemeContext);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFundType, setSelectedFundType] = useState(null);

  useEffect(() => {
    getFunds()
      .then((data) => setFunds(data))
      .catch(() => setFunds([]))
      .finally(() => setLoading(false));
  }, []);

  const fundTypes = [...new Set(funds.map((f) => f.fund_type))].filter(Boolean).sort();

  const filteredFunds = funds
    .filter((fund) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        fund.symbol.toLowerCase().includes(searchLower) ||
        fund.fund_name.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (selectedFundType && fund.fund_type !== selectedFundType) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Show selected tickers first
      const aSelected = selectedTickers.includes(a.symbol);
      const bSelected = selectedTickers.includes(b.symbol);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });

  const formatFundType = (type) => {
    if (type === "mutual_fund") return "Mutual Fund";
    if (type === "etf") return "ETF";
    return type;
  };

  if (loading) {
    return (
      <div className="mb-6">
        <label className={`block text-sm mb-2 ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
          {label}
        </label>
        <div className={`border rounded-lg p-6 text-center ${dark ? "border-[#2a3a4e]" : "border-gs-border"}`}>
          <div className={`text-sm ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>Loading funds...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-2">
        <label className={`block text-sm ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
          {label}
        </label>
        <span className={`text-xs ${dark ? "text-[#4a6a86]" : "text-gs-medium-gray"}`}>
          {selectedTickers.length} selected
        </span>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search by ticker or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 border px-3 py-2 rounded-lg text-sm focus:outline-none transition-colors ${
            dark
              ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#d4d8dd] focus:border-[#4A90D9] focus:ring-1 focus:ring-[#4A90D9]"
              : "bg-gs-white border-gs-border text-gs-text focus:border-gs-navy focus:ring-1 focus:ring-gs-navy"
          }`}
        />

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2 rounded-lg border transition-colors ${
              dark
                ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#d4d8dd] hover:bg-[#254052] cursor-pointer"
                : "bg-gs-white border-gs-border text-gs-text hover:bg-gs-light-gray cursor-pointer"
            }`}
            title="Filter funds"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3l-4 6v8l-4-3v-5l-4-6V3z" />
            </svg>
          </button>

          {showFilters && (
            <div
              className={`absolute right-0 mt-2 w-56 rounded-lg border shadow-lg z-50 ${
                dark ? "bg-[#0f1a2e] border-[#2a3a4e]" : "bg-gs-white border-gs-border"
              }`}
            >
              <div className="p-4">
                <h3 className={`text-sm font-semibold mb-3 ${dark ? "text-[#d4d8dd]" : "text-gs-text"}`}>
                  Fund Type
                </h3>
                <div className="space-y-2">
                  {fundTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="fundType"
                        checked={selectedFundType === type}
                        onChange={() => setSelectedFundType(type)}
                        className="accent-gs-navy w-4 h-4"
                      />
                      <span className={`text-sm ${dark ? "text-[#8aa8c4]" : "text-gs-dark-gray"}`}>
                        {formatFundType(type)}
                      </span>
                    </label>
                  ))}
                  {selectedFundType && (
                    <button
                      onClick={() => setSelectedFundType(null)}
                      className={`w-full text-left text-xs mt-2 pt-2 border-t ${
                        dark ? "border-[#2a3a4e] text-[#4A90D9]" : "border-gs-border text-gs-blue"
                      } hover:underline`}
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fund List with Checkboxes */}
      <div
        className={`border rounded-lg max-h-72 overflow-y-auto ${
          dark ? "border-[#2a3a4e]" : "border-gs-border"
        }`}
      >
        {filteredFunds.length === 0 ? (
          <div className={`px-4 py-6 text-center text-sm ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>
            No funds found
          </div>
        ) : (
          filteredFunds.map((fund) => {
            const isChecked = selectedTickers.includes(fund.symbol);
            return (
              <label
                key={fund.symbol}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm border-b last:border-b-0 ${
                  dark
                    ? `border-[#1e3050] ${isChecked ? "bg-[#1a2a3e]" : "hover:bg-[#111d30]"}`
                    : `border-gs-light-gray ${isChecked ? "bg-gs-navy/5" : "hover:bg-gs-light-gray"}`
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleTicker(fund.symbol)}
                  className="accent-gs-navy w-4 h-4 shrink-0"
                />
                <FundTooltip ticker={fund.symbol} dark={dark}>
                  <span className={`font-mono text-xs w-12 shrink-0 ${dark ? "text-[#4A90D9]" : "text-gs-navy"}`}>
                    {fund.symbol}
                  </span>
                </FundTooltip>
                <span className={`truncate ${dark ? "text-[#8aa8c4]" : "text-gs-dark-gray"}`}>
                  {fund.fund_name}
                </span>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
