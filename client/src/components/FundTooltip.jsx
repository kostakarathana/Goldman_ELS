import { useState, useEffect, useRef } from "react";
import { getFundByTicker } from "../services/api";

export default function FundTooltip({ ticker, children, dark }) {
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  // Reset info when ticker changes
  useEffect(() => {
    setInfo(null);
  }, [ticker]);

  useEffect(() => {
    if (ticker && show && !info && !loading) {
      setLoading(true);
      getFundByTicker(ticker.toUpperCase())
        .then((fundData) => {
          setInfo(fundData);
        })
        .catch((error) => {
          console.error("Failed to fetch fund info:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [ticker, show, info, loading]);

  // Update tooltip position when shown
  useEffect(() => {
    if (show && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [show]);

  if (!ticker) return children;

  const formatFundType = (fundType) => {
    switch (fundType) {
      case "mutual_fund":
        return "Mutual Fund";
      case "etf":
        return "ETF";
      default:
        return fundType;
    }
  };

  return (
    <span
      ref={triggerRef}
      className="inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          ref={tooltipRef}
          className={`fixed z-[9999] px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-lg pointer-events-none -translate-x-1/2 -translate-y-full ${
            dark
              ? "bg-[#1a2a3e] text-[#d4d8dd] border border-[#2a3a4e]"
              : "bg-gs-white text-gs-text border border-gs-border"
          }`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          {loading ? (
            <span className="block">Loading...</span>
          ) : info ? (
            <>
              <span className="block font-semibold">{info.company}</span>
              <span className={`block ${dark ? "text-[#6a8aaa]" : "text-gs-medium-gray"}`}>
                {info.category} · {formatFundType(info.fund_type)}
              </span>
            </>
          ) : (
            <span className="block">Fund info not available</span>
          )}
        </span>
      )}
    </span>
  );
}
