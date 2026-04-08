import { useState, useEffect, useContext, useRef } from "react";
import { getFunds } from "../services/api";
import { ThemeContext } from "../App";
import FundTooltip from "./FundTooltip";
import { FundListSkeleton } from "./Skeleton";

export default function FundSelector({ selected, onSelect }) {
  const { dark } = useContext(ThemeContext);
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFundType, setSelectedFundType] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    getFunds()
      .then((data) => setFunds(data))
      .catch(() => setFunds([]))
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close filters when search closes
  useEffect(() => {
    if (!searchOpen) {
      setShowFilters(false);
    }
  }, [searchOpen]);

  const selectedFund = funds.find((f) => f.symbol === selected);

  const fundTypes = [...new Set(funds.map((f) => f.fund_type))].filter(Boolean).sort();

  const filteredFunds = funds.filter((fund) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      fund.symbol.toLowerCase().includes(searchLower) ||
      fund.fund_name.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    if (selectedFundType && fund.fund_type !== selectedFundType) {
      return false;
    }

    return true;
  });

  const formatFundType = (type) => {
    if (type === "mutual_fund") return "Mutual Fund";
    if (type === "etf") return "ETF";
    return type;
  };

  if (loading) {
    return (
      <div className="mb-6">
        <label className={`block text-sm mb-2 ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>Fund</label>
        <FundListSkeleton rows={1} />
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className={`block text-sm mb-2 ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>
        Fund
      </label>
      
      {/* Search Input and Filter */}
      <div className="relative" ref={searchRef}>
        <div className="flex gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`flex-1 border px-3 py-2 rounded-lg text-left text-sm focus:outline-none transition-colors ${
              dark
                ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#d4d8dd] hover:border-[#4A90D9]"
                : "bg-gs-white border-gs-border text-gs-text hover:border-gs-navy"
            }`}
          >
            {selectedFund ? (
              <span className="font-medium">
                {selectedFund.symbol} — {selectedFund.fund_name}
              </span>
            ) : (
              <span className={dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}>
                Select a fund...
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => searchOpen && setShowFilters(!showFilters)}
              disabled={!searchOpen}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                searchOpen
                  ? dark
                    ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#d4d8dd] hover:bg-[#254052] cursor-pointer"
                    : "bg-gs-white border-gs-border text-gs-text hover:bg-gs-light-gray cursor-pointer"
                  : dark
                  ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#4a6a86] cursor-not-allowed opacity-50"
                  : "bg-gs-white border-gs-border text-gs-medium-gray cursor-not-allowed opacity-50"
              }`}
              title={searchOpen ? "Filter funds" : "Open search to filter"}
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

        {/* Fund List Dropdown */}
        {searchOpen && (
          <div
            className={`absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-lg z-40 ${
              dark ? "bg-[#0f1a2e] border-[#2a3a4e]" : "bg-gs-white border-gs-border"
            }`}
          >
            <input
              type="text"
              autoFocus
              placeholder="Search ticker or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border-b px-3 py-2 text-sm focus:outline-none ${
                dark
                  ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#d4d8dd]"
                  : "bg-gs-white border-gs-border text-gs-text"
              }`}
            />
            <div className="max-h-64 overflow-y-auto">
              {filteredFunds.length === 0 ? (
                <div className={`px-4 py-6 text-center text-sm ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>
                  No funds found
                </div>
              ) : (
                filteredFunds.map((fund) => (
                  <button
                    key={fund.symbol}
                    onClick={() => {
                      onSelect(fund.symbol);
                      setSearchOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full text-left px-4 py-2.5 border-b last:border-b-0 transition-colors text-sm hover:bg-opacity-50 ${
                      dark
                        ? "border-[#1e3050] hover:bg-[#111d30] text-[#d4d8dd]"
                        : "border-gs-light-gray hover:bg-gs-light-gray"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FundTooltip ticker={fund.symbol} dark={dark}>
                        <span className={`font-mono font-semibold w-16 ${dark ? "text-[#4A90D9]" : "text-gs-navy"}`}>
                          {fund.symbol}
                        </span>
                      </FundTooltip>
                      <span className={`truncate text-xs ${dark ? "text-[#8aa8c4]" : "text-gs-dark-gray"}`}>
                        {fund.fund_name}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div className="mt-2">
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
