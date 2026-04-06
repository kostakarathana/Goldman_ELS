import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import NumberAnimation from "./ResultsDisplay/NumberAnimation.jsx";
import {
  containerVariants, fadeUp, fadeIn, slideLeft, springPop, smoothIn,
} from "./ResultsDisplay/ResultsAnimations.jsx";
import PDFExport from "./PDFExport.jsx";
import { ThemeContext } from "../App";

const INFLATION_RATE = 0.03; // 3% average inflation

const fmt = (n) =>
  Number.isFinite(Number(n))
    ? Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "N/A";

const pct = (n) => (Number.isFinite(Number(n)) ? (Number(n) * 100).toFixed(2) + "%" : "N/A");
const fixed = (n, digits) => (Number.isFinite(Number(n)) ? Number(n).toFixed(digits) : "N/A");

function buildGrowthData(principal, rate, totalDays, adjustForInflation) {
  const totalYears = totalDays / 365;
  const points = 40;
  const effectiveRate = adjustForInflation ? (1 + rate) / (1 + INFLATION_RATE) - 1 : rate;
  return Array.from({ length: points + 1 }, (_, i) => {
    const years = (i / points) * totalYears;
    const days = Math.round(years * 365);
    const label =
      days < 30 ? `${days}d` : days < 365 ? `${Math.round(days / 30)}mo` : `${(days / 365).toFixed(1)}yr`;
    return { label, value: Math.round(principal * Math.pow(1 + effectiveRate, years)) };
  });
}

function buildWhatIfData(principal, rate, adjustForInflation) {
  const effectiveRate = adjustForInflation ? (1 + rate) / (1 + INFLATION_RATE) - 1 : rate;
  return [1, 2, 3, 5, 7, 10, 15, 20, 25, 30].map((yr) => ({
    label: `${yr}yr`,
    value: Math.round(principal * Math.pow(1 + effectiveRate, yr)),
  }));
}

function buildYearlyBreakdown(principal, rate, totalDays, adjustForInflation) {
  const totalYears = Math.ceil(totalDays / 365);
  const effectiveRate = adjustForInflation ? (1 + rate) / (1 + INFLATION_RATE) - 1 : rate;
  const rows = [];
  for (let y = 1; y <= Math.max(totalYears, 1); y++) {
    const fv = principal * Math.pow(1 + effectiveRate, y);
    const prevFv = y === 1 ? principal : principal * Math.pow(1 + effectiveRate, y - 1);
    rows.push({
      year: y,
      value: fv,
      gain: fv - principal,
      yearlyGain: fv - prevFv,
      returnPct: ((fv - principal) / principal) * 100,
    });
  }
  return rows;
}

export default function ResultsDisplay({ result, ticker, investment, duration }) {
  const { dark } = useContext(ThemeContext);
  const [inflationAdjusted, setInflationAdjusted] = useState(false);

  if (!result) return null;

  const fundName = result.fundName || ticker;
  const principal = Number(investment);
  const rate = Number(result.rate);
  const effectiveRate = inflationAdjusted ? (1 + rate) / (1 + INFLATION_RATE) - 1 : rate;
  const days = Number(duration);
  const years = days / 365;
  const futureValue = principal * Math.pow(1 + effectiveRate, years);
  const hasFutureValue = Number.isFinite(futureValue);
  const hasPrincipal = Number.isFinite(principal);
  const gain = hasFutureValue && hasPrincipal ? futureValue - principal : null;
  const gainPct = gain !== null && principal > 0 ? ((gain / principal) * 100).toFixed(1) : null;
  const principalBarPct = hasFutureValue && futureValue > 0 && hasPrincipal ? (principal / futureValue) * 100 : 0;
  const gainBarPct = hasFutureValue && futureValue > 0 && gain !== null ? (gain / futureValue) * 100 : 0;

  // Summary stats
  const annualizedReturn = effectiveRate * 100;
  const totalReturnPct = gain !== null && principal > 0 ? (gain / principal) * 100 : 0;
  const doublingTime = effectiveRate > 0 ? (Math.log(2) / Math.log(1 + effectiveRate)).toFixed(1) : "N/A";

  const formatDuration = (value) => {
    if (!Number.isFinite(value) || value <= 0) return "";
    if (value < 30) return `${value} ${value === 1 ? "day" : "days"}`;
    if (value < 365) { const m = Math.round(value / 30); return `${m} ${m === 1 ? "month" : "months"}`; }
    const yrs = (value / 365).toFixed(1);
    return `${yrs} ${yrs === "1.0" ? "year" : "years"}`;
  };

  const details = [
    { label: "CAPM Rate (r)", value: pct(result.rate) },
    { label: "Beta (β)", value: fixed(result.beta, 4) },
    { label: "Expected Return", value: pct(result.expectedReturn) },
    { label: "Risk-Free Rate", value: pct(result.riskFreeRate) },
  ];

  const growthData = buildGrowthData(principal, rate, days, inflationAdjusted);
  const whatIfData = buildWhatIfData(principal, rate, inflationAdjusted);
  const yearlyRows = buildYearlyBreakdown(principal, rate, days, inflationAdjusted);

  const cardBg = dark ? "bg-[#111d30] border-[#1e3050]" : "bg-white border-gs-border";
  const cardText = dark ? "text-[#d4d8dd]" : "text-gs-text";
  const mutedText = dark ? "text-[#6a8aaa]" : "text-gs-medium-gray";
  const headingText = dark ? "text-[#7fb3e0]" : "text-gs-navy";
  const chartStroke = dark ? "#4A90D9" : "#1A3B5C";
  const chartGold = dark ? "#D4BA7A" : "#B89D5A";
  const gridStroke = dark ? "#1e3050" : "#EDEDEB";
  const tooltipBg = dark ? "#1a2a3e" : "#fff";
  const tooltipBorder = dark ? "#2a3a4e" : "#D9D5CC";

  const tooltipStyle = {
    contentStyle: { background: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 8, fontSize: 12, color: dark ? "#d4d8dd" : "#2C2C2C" },
    formatter: (val) => [fmt(val), "Value"],
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${ticker}-${investment}-${duration}-${inflationAdjusted}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {/* Controls row: Inflation toggle + PDF export */}
        <motion.div variants={fadeIn} className="flex items-center justify-between mb-3">
          <label className={`flex items-center gap-2 text-xs cursor-pointer select-none ${mutedText}`}>
            <span
              onClick={() => setInflationAdjusted(!inflationAdjusted)}
              className={`relative inline-block w-9 h-5 rounded-full transition-colors duration-200 ${
                inflationAdjusted
                  ? dark ? "bg-[#4A90D9]" : "bg-gs-navy"
                  : dark ? "bg-[#2a3a4e]" : "bg-gs-light-gray"
              }`}
            >
              <span
                className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: inflationAdjusted ? "translateX(16px)" : "translateX(0)" }}
              />
            </span>
            Inflation-adjusted (3%)
          </label>
          <PDFExport result={result} ticker={ticker} investment={investment} duration={duration} />
        </motion.div>

        {/* Main result card */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -3, boxShadow: "0 30px 72px rgba(15,39,68,0.33), 0 6px 20px rgba(15,39,68,0.18)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            background: dark
              ? "linear-gradient(135deg, #0a1628 0%, #0f1e36 60%, #152a48 100%)"
              : "linear-gradient(135deg, #0f2744 0%, #1a3a5c 60%, #1f4d78 100%)",
            borderRadius: "20px", padding: "24px 28px 20px", marginBottom: "10px",
            boxShadow: dark
              ? "0 20px 60px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)"
              : "0 20px 60px rgba(15,39,68,0.25), 0 4px 16px rgba(15,39,68,0.15)",
          }}
        >
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ fontSize: "11px", fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.45)", margin: "0 0 10px", letterSpacing: "0.3px" }}>
            {fundName} ({ticker}){days ? ` · ${formatDuration(days)}` : ""}
            {inflationAdjusted ? " · Inflation-adjusted" : ""}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...smoothIn }}
            style={{ fontSize: "46px", fontWeight: 300, color: "#ffffff", letterSpacing: "-2px", lineHeight: 1, marginBottom: "8px" }}>
            <NumberAnimation value={hasFutureValue ? futureValue : 0} format={fmt} delay={0.3} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, ...smoothIn }}
            style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "18px" }}>
            <span style={{ fontSize: "28px", fontWeight: 500, color: "#3dba8c", letterSpacing: "-0.5px", lineHeight: 1 }}>
              {gain !== null ? (<>+<NumberAnimation value={gain} format={fmt} delay={0.5} /></>) : "Projection unavailable"}
            </span>
            <span style={{ fontSize: "12px", color: "rgba(61,186,140,0.65)", fontFamily: "Arial, sans-serif", fontWeight: 600 }}>
              {gainPct !== null ? `${gainPct}% return` : "Return unavailable"}
            </span>
          </motion.div>
          <div style={{ height: "6px", borderRadius: "3px", overflow: "hidden", background: "rgba(255,255,255,0.1)", display: "flex", marginBottom: "10px" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${principalBarPct}%` }} transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: "rgba(255,255,255,0.35)", borderRadius: "3px 0 0 3px" }} />
            <motion.div initial={{ width: 0 }} animate={{ width: `${gainBarPct}%` }} transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: "linear-gradient(90deg, #2d7a5f, #3dba8c)", borderRadius: "0 3px 3px 0" }} />
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
            style={{ display: "flex", gap: "20px", fontFamily: "Arial, sans-serif", fontSize: "11px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "rgba(255,255,255,0.35)" }} />
              <span style={{ color: "rgba(255,255,255,0.45)" }}>Principal {fmt(principal)}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: "#3dba8c" }} />
              <span style={{ color: "rgba(255,255,255,0.45)" }}>Growth +{fmt(gain)}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Summary Statistics */}
        <motion.div variants={fadeUp} className={`rounded-2xl border p-5 mb-3 ${cardBg}`}>
          <h3 className={`text-sm font-semibold mb-3 ${headingText}`} style={{ fontFamily: "Arial, sans-serif" }}>Summary Statistics</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Return", value: `${totalReturnPct.toFixed(1)}%`, accent: true },
              { label: "Annualized", value: `${annualizedReturn.toFixed(2)}%` },
              { label: "Doubling Time", value: doublingTime !== "N/A" ? `${doublingTime} yrs` : "N/A" },
              { label: "Risk (Beta)", value: fixed(result.beta, 2) },
            ].map(({ label, value, accent }) => (
              <div key={label} className="text-center">
                <p className={`text-xs uppercase tracking-wider mb-1 ${mutedText}`} style={{ fontFamily: "Arial, sans-serif" }}>{label}</p>
                <p className={`text-lg font-bold ${accent ? "text-gs-success" : headingText}`} style={{ fontFamily: "Arial, sans-serif" }}>{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Growth chart */}
        <motion.div variants={fadeUp} className={`rounded-2xl border p-6 mb-3 ${cardBg}`}>
          <h3 className={`text-sm font-semibold mb-4 ${headingText}`} style={{ fontFamily: "Arial, sans-serif" }}>
            Investment Growth Over Time
            {inflationAdjusted && <span className={`ml-2 text-xs font-normal ${mutedText}`}>(real terms)</span>}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={growthData} margin={{ top: 4, right: 16, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: dark ? "#6a8aaa" : "#B0ADA5" }} interval="preserveStartEnd" />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: dark ? "#6a8aaa" : "#B0ADA5" }} width={48} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke={chartStroke} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: chartStroke }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Yearly Breakdown Table */}
        <motion.div variants={fadeUp} className={`rounded-2xl border overflow-hidden mb-3 ${cardBg}`}>
          <div className={`px-6 py-3 border-b ${dark ? "bg-[#0f1a2e] border-[#1e3050]" : "bg-[#f8fafc] border-[#e4eaf0]"}`}>
            <h3 className={`text-sm font-semibold ${headingText}`} style={{ fontFamily: "Arial, sans-serif" }}>
              Year-by-Year Breakdown
              {inflationAdjusted && <span className={`ml-2 text-xs font-normal ${mutedText}`}>(real terms)</span>}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "Arial, sans-serif" }}>
              <thead>
                <tr className={dark ? "bg-[#0f1a2e]" : "bg-[#f8fafc]"}>
                  <th className={`px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Year</th>
                  <th className={`px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Value</th>
                  <th className={`px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Year Gain</th>
                  <th className={`px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Total Gain</th>
                  <th className={`px-4 py-2 text-right text-xs font-semibold uppercase tracking-wider ${mutedText}`}>Return %</th>
                </tr>
              </thead>
              <tbody>
                {yearlyRows.map((row, i) => (
                  <tr key={row.year} className={`border-t ${dark ? "border-[#1e3050]" : "border-[#f0f4f8]"} ${i % 2 === 0 ? "" : dark ? "bg-[#0d1525]" : "bg-[#fbfbfa]"}`}>
                    <td className={`px-4 py-2 font-semibold ${headingText}`}>{row.year}</td>
                    <td className={`px-4 py-2 text-right font-mono ${cardText}`}>{fmt(row.value)}</td>
                    <td className="px-4 py-2 text-right font-mono text-gs-success">+{fmt(row.yearlyGain)}</td>
                    <td className="px-4 py-2 text-right font-mono text-gs-success">+{fmt(row.gain)}</td>
                    <td className={`px-4 py-2 text-right font-mono ${cardText}`}>{row.returnPct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* What-if simulator */}
        <motion.div variants={fadeUp} className={`rounded-2xl border p-6 mb-3 ${cardBg}`}>
          <h3 className={`text-sm font-semibold mb-1 ${headingText}`} style={{ fontFamily: "Arial, sans-serif" }}>What If Simulator</h3>
          <p className={`text-xs mb-4 ${mutedText}`} style={{ fontFamily: "Arial, sans-serif" }}>Same fund & investment across different time horizons</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={whatIfData} margin={{ top: 4, right: 16, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: dark ? "#6a8aaa" : "#B0ADA5" }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: dark ? "#6a8aaa" : "#B0ADA5" }} width={48} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke={chartGold} strokeWidth={2} dot={{ r: 3, fill: chartGold }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Calculation details */}
        <motion.div variants={fadeUp} whileHover={{ y: -3, boxShadow: dark ? "0 10px 28px rgba(0,0,0,0.3)" : "0 10px 28px rgba(0,0,0,0.08)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`rounded-2xl border overflow-hidden mb-3 ${cardBg}`}
          style={{ boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div className={`px-5 py-3 border-b ${dark ? "bg-[#0f1a2e] border-[#1e3050]" : "bg-[#f8fafc] border-[#e4eaf0]"}`}>
            <p className={`text-[10px] font-bold tracking-[2.5px] uppercase ${mutedText}`} style={{ fontFamily: "Arial, sans-serif", margin: 0 }}>
              Calculation Details
            </p>
          </div>
          <motion.div variants={containerVariants}>
            {details.map(({ label, value }, i) => (
              <motion.div key={label} variants={slideLeft}
                className={`flex justify-between items-center px-5 py-2.5 ${i < details.length - 1 ? `border-b ${dark ? "border-[#1e3050]" : "border-[#f0f4f8]"}` : ""}`}>
                <span className={`text-xs ${dark ? "text-[#6a8aaa]" : "text-[#4a5e72]"}`} style={{ fontFamily: "Arial, sans-serif" }}>{label}</span>
                <motion.span initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65 + i * 0.07, ...springPop }}
                  className={`text-xs font-bold rounded-md px-2 py-0.5 ${dark ? "bg-[#1a2a3e] text-[#7fb3e0]" : "bg-[#f0f4fa] text-[#1a3a5c]"}`}
                  style={{ fontFamily: "Arial, sans-serif" }}>
                  {value}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.p variants={fadeIn}
          className={`text-[10px] leading-relaxed text-center max-w-[480px] mx-auto mt-3 ${mutedText}`}
          style={{ fontFamily: "Arial, sans-serif" }}>
          This calculator is for illustrative purposes only. Projections are based on historical data and CAPM. Past performance does not guarantee future results.
          {inflationAdjusted && " Inflation adjustment uses a 3% annual rate."}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
