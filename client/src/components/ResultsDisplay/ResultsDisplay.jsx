import { motion, AnimatePresence } from "framer-motion";

import NumberAnimation from "./NumberAnimation.jsx";
import {
  containerVariants,
  fadeUp,
  fadeIn,
  slideLeft,
  springPop,
  smoothIn,
} from "./ResultsAnimations.jsx";

const fmt = (n) =>
  Number.isFinite(Number(n))
    ? Number(n).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : "N/A";
const pct = (n) =>
  Number.isFinite(Number(n)) ? (Number(n) * 100).toFixed(2) + "%" : "N/A";
const fixed = (n, digits) =>
  Number.isFinite(Number(n)) ? Number(n).toFixed(digits) : "N/A";

export default function ResultsDisplay({
  result,
  ticker,
  investment,
  duration,
}) {
  if (!result) return null;

  const fundName = result.fundName || ticker;
  const principal = Number(investment);
  const futureValue = Number(result.futureValue);
  const hasFutureValue = Number.isFinite(futureValue);
  const hasPrincipal = Number.isFinite(principal);
  const gain = hasFutureValue && hasPrincipal ? futureValue - principal : null;
  const gainPct =
    gain !== null && principal > 0 ? ((gain / principal) * 100).toFixed(1) : null;
  const principalBarPct =
    hasFutureValue && futureValue > 0 && hasPrincipal ? (principal / futureValue) * 100 : 0;
  const gainBarPct =
    hasFutureValue && futureValue > 0 && gain !== null ? (gain / futureValue) * 100 : 0;

  const details = [
    { label: "CAPM Rate (r)", value: pct(result.rate) },
    { label: "Beta (β)", value: fixed(result.beta, 4) },
    { label: "Expected Return", value: pct(result.expectedReturn) },
    { label: "Risk-Free Rate", value: pct(result.riskFreeRate) },
  ];
  const days = Number(duration);
  const formatDuration = (value) => {
    if (!Number.isFinite(value) || value <= 0) return "";
    if (value < 30) return `${value} ${value === 1 ? "day" : "days"}`;
    if (value < 365) {
      const months = Math.round(value / 30);
      return `${months} ${months === 1 ? "month" : "months"}`;
    }
    const years = (value / 365).toFixed(1);
    return `${years} ${years === "1.0" ? "year" : "years"}`;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${ticker}-${investment}-${duration}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ fontFamily: "Georgia, serif" }}
      >
        <motion.div
          variants={fadeUp}
          whileHover={{
            y: -3,
            boxShadow:
              "0 30px 72px rgba(15,39,68,0.33), 0 6px 20px rgba(15,39,68,0.18)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            background:
              "linear-gradient(135deg, #0f2744 0%, #1a3a5c 60%, #1f4d78 100%)",
            borderRadius: "20px",
            padding: "24px 28px 20px",
            marginBottom: "10px",
            boxShadow:
              "0 20px 60px rgba(15,39,68,0.25), 0 4px 16px rgba(15,39,68,0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "11px",
              fontFamily: "Arial, sans-serif",
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 10px",
              letterSpacing: "0.3px",
            }}
          >
            {fundName} ({ticker}){days ? ` · ${formatDuration(days)}` : ""}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...smoothIn }}
            style={{
              fontSize: "46px",
              fontWeight: 300,
              color: "#ffffff",
              letterSpacing: "-2px",
              lineHeight: 1,
              marginBottom: "8px",
            }}
          >
            <NumberAnimation
              value={hasFutureValue ? futureValue : 0}
              format={fmt}
              delay={0.3}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, ...smoothIn }}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "10px",
              marginBottom: "18px",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                fontWeight: 500,
                color: "#3dba8c",
                letterSpacing: "-0.5px",
                lineHeight: 1,
                fontFamily: "Georgia, serif",
              }}
            >
              {gain !== null ? (
                <>
                  +<NumberAnimation value={gain} format={fmt} delay={0.5} />
                </>
              ) : (
                "Projection unavailable"
              )}
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "rgba(61,186,140,0.65)",
                fontFamily: "Arial, sans-serif",
                fontWeight: 600,
              }}
            >
              {gainPct !== null ? `${gainPct}% return` : "Return unavailable"}
            </span>
          </motion.div>
          <div
            style={{
              height: "6px",
              borderRadius: "3px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              marginBottom: "10px",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${principalBarPct}%` }}
              transition={{
                duration: 0.9,
                delay: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                background: "rgba(255,255,255,0.35)",
                borderRadius: "3px 0 0 3px",
              }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${gainBarPct}%` }}
              transition={{
                duration: 0.9,
                delay: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                background: "linear-gradient(90deg, #2d7a5f, #3dba8c)",
                borderRadius: "0 3px 3px 0",
              }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            style={{
              display: "flex",
              gap: "20px",
              fontFamily: "Arial, sans-serif",
              fontSize: "11px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  background: "rgba(255,255,255,0.35)",
                }}
              />
              <span style={{ color: "rgba(255,255,255,0.45)" }}>
                Principal {fmt(principal)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "2px",
                  background: "#3dba8c",
                }}
              />
              <span style={{ color: "rgba(255,255,255,0.45)" }}>
                Growth +{fmt(gain)}
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          whileHover={{
            y: -3,
            boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e4eaf0",
            overflow: "hidden",
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              padding: "11px 20px",
              borderBottom: "1px solid #e4eaf0",
              background: "#f8fafc",
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontFamily: "Arial, sans-serif",
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#9aabbb",
                margin: 0,
              }}
            >
              Calculation Details
            </p>
          </div>

          <motion.div variants={containerVariants}>
            {details.map(({ label, value }, i) => (
              <motion.div
                key={label}
                variants={slideLeft}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 20px",
                  borderBottom:
                    i < details.length - 1 ? "1px solid #f0f4f8" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#4a5e72",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {label}
                </span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.65 + i * 0.07, ...springPop }}
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    fontFamily: "Arial, sans-serif",
                    color: "#1a3a5c",
                    background: "#f0f4fa",
                    borderRadius: "5px",
                    padding: "2px 8px",
                  }}
                >
                  {value}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          variants={fadeIn}
          style={{
            fontSize: "10px",
            color: "#a0b0c0",
            lineHeight: "1.6",
            textAlign: "center",
            maxWidth: "480px",
            margin: "12px auto 0",
            fontFamily: "Arial, sans-serif",
          }}
        >
          
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
