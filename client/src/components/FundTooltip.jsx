import { useState } from "react";

const FUND_INFO = {
  VSMPX: { category: "Large Blend", company: "Vanguard", type: "Index" },
  FXAIX: { category: "Large Blend", company: "Fidelity", type: "Index" },
  VFIAX: { category: "Large Blend", company: "Vanguard", type: "Index" },
  VTSAX: { category: "Large Blend", company: "Vanguard", type: "Index" },
  SPAXX: { category: "Money Market", company: "Fidelity", type: "Government" },
  VMFXX: { category: "Money Market", company: "Vanguard", type: "Government" },
  VGTSX: { category: "International", company: "Vanguard", type: "Index" },
  SWVXX: { category: "Money Market", company: "Schwab", type: "Prime" },
  FDRXX: { category: "Money Market", company: "Fidelity", type: "Government" },
  FGTXX: { category: "Money Market", company: "Goldman Sachs", type: "Government" },
  OGVXX: { category: "Money Market", company: "JPMorgan", type: "Government" },
  FCTDX: { category: "Large Blend", company: "Fidelity", type: "Active" },
  VIIIX: { category: "Large Blend", company: "Vanguard", type: "Index" },
  FRGXX: { category: "Money Market", company: "Fidelity", type: "Government" },
  VTBNX: { category: "Bond", company: "Vanguard", type: "Index" },
  MVRXX: { category: "Money Market", company: "Morgan Stanley", type: "Government" },
  TFDXX: { category: "Money Market", company: "BlackRock", type: "Government" },
  GVMXX: { category: "Money Market", company: "State Street", type: "Government" },
  AGTHX: { category: "Large Growth", company: "American Funds", type: "Active" },
  VTBIX: { category: "Bond", company: "Vanguard", type: "Index" },
  CJTTX: { category: "Money Market", company: "JPMorgan", type: "Treasury" },
  TTTXX: { category: "Money Market", company: "BlackRock", type: "Treasury" },
  FCNTX: { category: "Large Growth", company: "Fidelity", type: "Active" },
  SNAXX: { category: "Money Market", company: "Schwab", type: "Prime" },
  PIMIX: { category: "Bond", company: "PIMCO", type: "Active" },
};

export default function FundTooltip({ ticker, children, dark }) {
  const [show, setShow] = useState(false);
  const info = FUND_INFO[ticker?.toUpperCase()];

  if (!info) return children;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          className={`absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg pointer-events-none ${
            dark
              ? "bg-[#1a2a3e] text-[#d4d8dd] border border-[#2a3a4e]"
              : "bg-gs-white text-gs-text border border-gs-border"
          }`}
        >
          <span className="block font-semibold">{info.company}</span>
          <span className={`block ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>
            {info.category} · {info.type}
          </span>
        </span>
      )}
    </span>
  );
}
