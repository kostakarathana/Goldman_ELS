import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import NumberAnimation from "./ResultsDisplay/NumberAnimation.jsx";
import {
  containerVariants, fadeUp, fadeIn, slideLeft, springPop, smoothIn,
} from "./ResultsDisplay/ResultsAnimations.jsx";

const fmt = (n) =>
  Number.isFinite(Number(n))
    ? Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "N/A";

const pct = (n) => (Number.isFinite(Number(n)) ? (Number(n) * 100).toFixed(2) + "%" : "N/A");
const fixed = (n, digits) => (Number.isFinite(Number(n)) ? Number(n).toFixed(digits) : "N/A");

function buildGrowthData(principal, rate, totalDays) {
  const totalYears = totalDays / 365;
  const points = 40;
  return Array.from({ length: points + 1 }, (_, i) => {
    const years = (i / points) * totalYears;
    const days = Math.round(years * 365);
    const label =
      days < 30 ? `${days}d` : days < 365 ? `${Math.round(days / 30)}mo` : `${(days / 365).toFixed(1)}yr`;
    return { label, value: Math.round(principal * Math.pow(1 + rate, years)) };
  });
}

function buildWhatIfData(principal, rate) {
  return [1, 2, 3, 5, 7, 10, 15, 20, 25, 30].map((yr) => ({
    label: `${yr}yr`,
    value: Math.round(principal * Math.pow(1 + rate, yr)),
  }));
}

const tooltipStyle = {
  contentStyle: { background: "#fff", border: "1px solid #D9D5CC", borderRadius: 8, fontSize: 12 },
  formatter: (val) => [fmt(val), "Value"],
};

export default function ResultsDisplay({ result, ticker, investment, duration }) {
  if (!result) return null;

  const fundName = result.fundName || ticker;
  const principal = Number(investment);
  const futureValue = Number(result.futureValue);
  const hasFutureValue = Number.isFinite(futureValue);
  const hasPrincipal = Number.isFinite(principal);
  const gain = hasFutureValue && hasPrincipal ? futureValue - principal : null;
  const gainPct = gain !== null && principal > 0 ? ((gain / principal) * 100).toFixed(1) : null;
  const principalBarPct = hasFutureValue && futureValue > 0 && hasPrincipal ? (principal / futureValue) * 100 : 0;
  const gainBarPct = hasFutureValue && futureValue > 0 && gain !== null ? (gain / futureValue) * 100 : 0;
  const days = Number(duration);

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

  const growthData = buildGrowthData(principal, result.rate, days);
  const whatIfData = buildWhatIfData(principal, result.rate);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${ticker}-${investment}-${duration}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {/* Main result card */}
        <motion.div
          variants={fadeUp}
          whileHover={{ y: -3, boxShadow: "0 30px 72px rgba(15,39,68,0.33), 0 6px 20px rgba(15,39,68,0.18)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            background: "linear-gradient(135deg, #0f2744 0%, #1a3a5c 60%, #1f4d78 100%)",
            borderRadius: "20px", padding: "24px 28px 20px", marginBottom: "10px",
            boxShadow: "0 20px 60px rgba(15,39,68,0.25), 0 4px 16px rgba(15,39,68,0.15)",
          }}
        >
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ fontSize: "11px", fontFamily: "Arial, sans-serif", color: "rgba(255,255,255,0.45)", margin: "0 0 10px", letterSpacing: "0.3px" }}>
            {fundName} ({ticker}){days ? ` · ${formatDuration(days)}` : ""}
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

        {/* Growth chart */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gs-border p-6 mb-3">
          <h3 className="text-sm font-semibold text-gs-navy mb-4" style={{ fontFamily: "Arial, sans-serif" }}>Investment Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={growthData} margin={{ top: 4, right: 16, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDEDEB" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#B0ADA5" }} interval="preserveStartEnd" />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#B0ADA5" }} width={48} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke="#1A3B5C" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: "#1A3B5C" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* What-if simulator */}
        <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-gs-border p-6 mb-3">
          <h3 className="text-sm font-semibold text-gs-navy mb-1" style={{ fontFamily: "Arial, sans-serif" }}>What If Simulator</h3>
          <p className="text-xs text-gs-medium-gray mb-4" style={{ fontFamily: "Arial, sans-serif" }}>Same fund & investment across different time horizons</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={whatIfData} margin={{ top: 4, right: 16, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDEDEB" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#B0ADA5" }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#B0ADA5" }} width={48} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="value" stroke="#B89D5A" strokeWidth={2} dot={{ r: 3, fill: "#B89D5A" }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Calculation details */}
        <motion.div variants={fadeUp} whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.08)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ background: "#ffffff", borderRadius: "16px", border: "1px solid #e4eaf0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: "10px" }}>
          <div style={{ padding: "11px 20px", borderBottom: "1px solid #e4eaf0", background: "#f8fafc" }}>
            <p style={{ fontSize: "10px", fontFamily: "Arial, sans-serif", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#9aabbb", margin: 0 }}>
              Calculation Details
            </p>
          </div>
          <motion.div variants={containerVariants}>
            {details.map(({ label, value }, i) => (
              <motion.div key={label} variants={slideLeft}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: i < details.length - 1 ? "1px solid #f0f4f8" : "none" }}>
                <span style={{ fontSize: "12px", color: "#4a5e72", fontFamily: "Arial, sans-serif" }}>{label}</span>
                <motion.span initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.65 + i * 0.07, ...springPop }}
                  style={{ fontSize: "12px", fontWeight: 700, fontFamily: "Arial, sans-serif", color: "#1a3a5c", background: "#f0f4fa", borderRadius: "5px", padding: "2px 8px" }}>
                  {value}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.p variants={fadeIn}
          style={{ fontSize: "10px", color: "#a0b0c0", lineHeight: "1.6", textAlign: "center", maxWidth: "480px", margin: "12px auto 0", fontFamily: "Arial, sans-serif" }}>
          This calculator is for illustrative purposes only. Projections are based on historical data and CAPM. Past performance does not guarantee future results.
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
