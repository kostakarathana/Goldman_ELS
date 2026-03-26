/**
 * routes/calculate.js
 * GET /future-value
 * Query params: ticker, investment, duration
 * Flow: frontend inputs → backend service → Newton API (beta) → CAPM calc → frontend result
 * Response: { futureValue, rate, beta, expectedReturn, riskFreeRate }
 */

import express from "express";
import { computeRate, computeFutureValue } from "../services/calculatorService.js";
import { getBeta } from "../services/betaService.js";
import { getExpectedReturn } from "../services/returnService.js";
import { getFundByTicker } from "../services/fundService.js";

const router = express.Router();

// risk‑free rate used throughout (could be configurable)
const RISK_FREE_RATE = 0.0425;

router.get("/future-value", async (req, res) => {
  const { ticker, investment, duration } = req.query;
  if (!ticker || !investment || !duration) {
    return res
      .status(400)
      .json({ error: "ticker, investment and duration are required" });
  }

  try {
    const beta = await getBeta(ticker);
    const expectedReturn = await getExpectedReturn(ticker);
    const rate = computeRate(beta, expectedReturn, RISK_FREE_RATE);
    const years = Number(duration) / 365;
    const futureValue = computeFutureValue(Number(investment), rate, years);

    const fund = await getFundByTicker(ticker);
    const fundName = fund ? fund.name : ticker;

    res.json({
      futureValue,
      rate,
      beta,
      expectedReturn,
      riskFreeRate: RISK_FREE_RATE,
      fundName,
    });
  } catch (err) {
    console.error("/future-value error", err);
    res.status(500).json({ error: "calculation failed" });
  }
});

export default router;
