import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../App";

export default function InvestmentForm({ investment, onInvestmentChange, onDurationChange }) {
  const { dark } = useContext(ThemeContext);
  const [years, setYears] = useState(1);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const total = Math.max(1, years * 365 + months * 30 + days);
    onDurationChange(String(total));
  }, [years, months, days, onDurationChange]);

  const parts = [
    years > 0 ? `${years} ${years === 1 ? "Year" : "Years"}` : null,
    months > 0 ? `${months} ${months === 1 ? "Month" : "Months"}` : null,
    days > 0 ? `${days} ${days === 1 ? "Day" : "Days"}` : null,
  ].filter(Boolean);
  const summary = parts.length > 0 ? parts.join(", ") : "0 Days";

  const inputCls = dark
    ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#d4d8dd] focus:border-[#4A90D9] focus:ring-1 focus:ring-[#4A90D9]"
    : "bg-gs-white border-gs-border text-gs-text focus:border-gs-navy focus:ring-1 focus:ring-gs-navy";

  return (
    <div className="space-y-6 mb-6">
      {/* Investment amount */}
      <div>
        <label className={`block text-sm mb-2 ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>Initial Investment</label>
        <div className="relative">
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg ${dark ? "text-[#4a6a86]" : "text-gs-medium-gray"}`}>$</span>
          <input
            type="number"
            min="0"
            step="100"
            placeholder="10,000"
            value={investment}
            onChange={(e) => onInvestmentChange(e.target.value)}
            className={`w-full border pl-9 pr-4 py-3 rounded-lg focus:outline-none transition-colors text-lg ${inputCls}`}
          />
        </div>
      </div>

      {/* Duration */}
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <label className={`text-sm ${dark ? "text-[#6a8aaa]" : "text-gs-dark-gray"}`}>Investment Duration</label>
          <span className={`text-sm font-semibold ${dark ? "text-[#7fb3e0]" : "text-gs-navy"}`}>{summary}</span>
        </div>

        <div className="space-y-4">
          {[
            { label: "Years", value: years, setValue: setYears, max: 30, marks: ["0","5","10","15","20","25","30"] },
            { label: "Months", value: months, setValue: setMonths, max: 11, marks: ["0","3","6","9","11"] },
            { label: "Days", value: days, setValue: setDays, max: 30, marks: ["0","10","20","30"] },
          ].map(({ label, value, setValue, max, marks }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs ${dark ? "text-[#5a7a96]" : "text-gs-medium-gray"}`}>{label}</span>
                <input
                  type="number"
                  min="0"
                  max={max}
                  value={value}
                  onChange={(e) => {
                    const v = Math.min(max, Math.max(0, Number(e.target.value) || 0));
                    setValue(v);
                  }}
                  className={`w-14 text-xs text-center font-semibold border rounded-md py-0.5 focus:outline-none ${
                    dark
                      ? "bg-[#1a2a3e] border-[#2a3a4e] text-[#7fb3e0] focus:border-[#4A90D9]"
                      : "text-gs-navy border-gs-border focus:border-gs-navy"
                  }`}
                />
              </div>
              <input
                type="range"
                min="0"
                max={max}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className={`flex justify-between text-xs mt-0.5 ${dark ? "text-[#5a7a96]" : "text-gs-medium-gray"}`}>
                {marks.map((m) => <span key={m}>{m}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
