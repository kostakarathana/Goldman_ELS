/**
 * routes/compare.js
 * GET /compare
 * Accepts multiple tickers, investment, and duration.
 * Returns predicted future values for side-by-side comparison.
 * (Bonus feature)
 */

/**
 * routes/compare.js
 * GET /api/compare
 * Query params: tickers[], investment, duration
 * Flow: for each ticker → returnService → betaService → calculatorService → return results
 */

import express from "express";
import { getExpectedReturn } from "../services/returnService.js";
import { getBeta } from "../services/betaService.js";
import { getFundYield } from "../services/yieldService.js";
import { computeRate, computeFutureValue } from "../services/calculatorService.js";

const router = express.Router();

const RISK_FREE_RATE = 0.0425; // same value used in calculate.js


router.get("/", async (req, res) => {
  let { tickers, investment, duration } = req.query;

  // 1. Validate inputs
  if (!tickers || !investment || !duration) {
    return res.status(400).json({
      error: "tickers[], investment, and duration are required",
    });
  }

  // normalize tickers to array if only one was passed
  if (!Array.isArray(tickers)) {
    tickers = [tickers];
  }

  const inv = Number(investment);
  const dur = Number(duration);

  if (isNaN(inv) || isNaN(dur) || inv <= 0 || dur <= 0) {
    return res.status(400).json({
      error: "investment and duration must be positive numbers",
    });
  }

  try {
    // 2. For each ticker, run the same flow as calculate.js but in parallel
    const results = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const years = dur / 365;
          const beta = await getBeta(ticker);
          let rate, expectedReturn, futureValue, method;

          if (beta !== null) {
            expectedReturn = await getExpectedReturn(ticker);
            rate = computeRate(beta, expectedReturn, RISK_FREE_RATE);
            futureValue = computeFutureValue(inv, rate, years);
            method = "capm";
          } else {
            rate = await getFundYield(ticker);
            futureValue = computeFutureValue(inv, rate, years);
            expectedReturn = rate;
            method = "yield";
          }

          return {
            ticker: ticker.toUpperCase(),
            futureValue: parseFloat(futureValue.toFixed(2)),
            rate: parseFloat(rate.toFixed(6)),
            beta: beta !== null ? parseFloat(beta.toFixed(4)) : null,
            expectedReturn: parseFloat(expectedReturn.toFixed(6)),
            riskFreeRate: RISK_FREE_RATE,
            method,
          };
        } catch (err) {
          // if one ticker fails, don't crash everything — return an error for just that ticker
          console.error(`Error processing ticker ${ticker}:`, err.message);
          return {
            ticker: ticker.toUpperCase(),
            error: `Could not retrieve data for ${ticker}`,
          };
        }
      })
    );

    // 3. Sort by futureValue descending (best fund first), errors go to the bottom
    results.sort((a, b) => {
      if (a.error) return 1;
      if (b.error) return -1;
      return b.futureValue - a.futureValue;
    });

    res.json(results);
  } catch (err) {
    console.error("/compare error", err);
    res.status(500).json({ error: "comparison failed" });
  }
});

export default router;