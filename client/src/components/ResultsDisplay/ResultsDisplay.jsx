import { motion, AnimatePresence } from "framer-motion";
import { MOCK_FUNDS } from "../../data/mockData";

import NumberAnimation from "./NumberAnimation.jsx";
import {
  containerVariants,
  fadeUp,
  fadeIn,
  slideLeft,
  springPop,
  smoothIn,
  slowEaseOut,
} from "./ResultsAnimations.jsx";

// ── Formatters ────────────────────────────────
const fmt = (n) =>
  Number(n).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
const pct = (n) => (Number(n) * 100).toFixed(2) + "%";

// ─────────────────────────────────────────────
export default function ResultsDisplay({
  result,
  ticker,
  investment,
  duration,
}) {
  if (!result) return null;

  const fund = MOCK_FUNDS.find((f) => f.ticker === ticker);
  const fundName = fund ? fund.fundName : ticker;
  const principal = Number(investment);
  const gain = result.futureValue - principal;
  const gainPct = ((gain / principal) * 100).toFixed(1);
  const principalBarPct = (principal / result.futureValue) * 100;
  const gainBarPct = (gain / result.futureValue) * 100;

  const details = [
    { label: "CAPM Rate (r)", value: pct(result.rate) },
    { label: "Beta (β)", value: result.beta.toFixed(4) },
    { label: "Expected Return", value: pct(result.expectedReturn) },
    { label: "Risk-Free Rate", value: pct(result.riskFreeRate) },
  ];

  const subCards = [
    {
      label: "Initial Investment",
      value: fmt(principal),
      labelColor: "#9aabbb",
      valueColor: "#1a3a5c",
      bg: "#ffffff",
      border: "#e4eaf0",
      shadow: "rgba(0,0,0,0.05)",
    },
    {
      label: "Interest Earned",
      value: `+${fmt(gain)}`,
      labelColor: "#2d7a5f",
      valueColor: "#2d7a5f",
      bg: "#f0faf5",
      border: "#b8e8d4",
      shadow: "rgba(45,122,95,0.08)",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${ticker}-${investment}-${duration}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ marginTop: "40px", fontFamily: "Georgia, serif" }}
      >
        {/* ── Header ── */}
        <motion.div
          variants={fadeUp}
          style={{ textAlign: "center", marginBottom: "32px" }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 400,
              color: "#1a3a5c",
              margin: "0 0 8px",
              letterSpacing: "-0.5px",
            }}
          >
            Your Estimated Returns
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#7a8a99",
              margin: 0,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {fundName} ({ticker}) · {duration}{" "}
            {Number(duration) === 1 ? "year" : "years"}
          </p>
        </motion.div>

        {/* ── Hero Card ── */}
        <motion.div
          variants={fadeUp}
          whileHover={{
            y: -3,
            boxShadow:
              "0 30px 72px rgba(15,39,68,0.33), 0 6px 20px rgba(15,39,68,0.18)",
          }}
          style={{
            background:
              "linear-gradient(135deg, #0f2744 0%, #1a3a5c 60%, #1f4d78 100%)",
            borderRadius: "20px",
            padding: "36px 32px 28px",
            marginBottom: "14px",
            boxShadow:
              "0 20px 60px rgba(15,39,68,0.25), 0 4px 16px rgba(15,39,68,0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: "10px",
              fontFamily: "Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: "rgba(200,180,130,0.9)",
              margin: "0 0 12px",
            }}
          >
            Estimated Future Value
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...smoothIn }}
            style={{
              fontSize: "52px",
              fontWeight: 300,
              color: "#ffffff",
              letterSpacing: "-2px",
              lineHeight: 1,
              margin: "0 0 12px",
            }}
          >
            <NumberAnimation
              value={result.futureValue}
              format={fmt}
              delay={0.4}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, ...springPop }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(61,186,140,0.18)",
              border: "1px solid rgba(61,186,140,0.3)",
              borderRadius: "20px",
              padding: "4px 14px",
              marginBottom: "28px",
            }}
          >
            <span
              style={{
                color: "#3dba8c",
                fontSize: "13px",
                fontFamily: "Arial, sans-serif",
                fontWeight: 600,
              }}
            >
              ▲ <NumberAnimation value={gain} format={fmt} delay={0.6} /> (
              {gainPct}%)
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
              fontFamily: "Arial, sans-serif",
              fontSize: "11px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  background: "rgba(255,255,255,0.35)",
                }}
              />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Principal {fmt(principal)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "2px",
                  background: "#3dba8c",
                }}
              />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                Growth +{fmt(gain)}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Sub-cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "14px",
          }}
        >
          {subCards.map(
            ({ label, value, labelColor, valueColor, bg, border, shadow }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                whileHover={{
                  y: -3,
                  boxShadow: `0 10px 28px ${shadow}`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{
                  background: bg,
                  border: `1px solid ${border}`,
                  borderRadius: "16px",
                  padding: "24px 20px",
                  textAlign: "center",
                  boxShadow: `0 2px 10px ${shadow}`,
                  cursor: "default",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontFamily: "Arial, sans-serif",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: labelColor,
                    margin: "0 0 10px",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: "24px",
                    fontWeight: 400,
                    color: valueColor,
                    margin: 0,
                    letterSpacing: "-0.5px",
                  }}
                >
                  {value}
                </p>
              </motion.div>
            ),
          )}
        </div>

        {/* ── Calculation Details ── */}
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
              padding: "14px 24px",
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
                  padding: "15px 24px",
                  borderBottom:
                    i < details.length - 1 ? "1px solid #f0f4f8" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#4a5e72",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {label}
                </span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.75 + i * 0.07, ...springPop }}
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "Arial, sans-serif",
                    color: "#1a3a5c",
                    background: "#f0f4fa",
                    borderRadius: "6px",
                    padding: "3px 10px",
                  }}
                >
                  {value}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Disclaimer ── */}
        <motion.p
          variants={fadeIn}
          style={{
            fontSize: "11px",
            color: "#a0b0c0",
            lineHeight: "1.7",
            textAlign: "center",
            maxWidth: "480px",
            margin: "20px auto 0",
            fontFamily: "Arial, sans-serif",
          }}
        >
          This calculator is for illustrative purposes only. Projections are
          based on historical data and the Capital Asset Pricing Model. Past
          performance does not guarantee future results.
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
