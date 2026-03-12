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
          const beta = await getBeta(ticker);                              //  betaService
          const expectedReturn = await getExpectedReturn(ticker);          // returnService
          const rate = computeRate(beta, expectedReturn, RISK_FREE_RATE);  // calculatorService
          const years = dur / 365;
          const futureValue = computeFutureValue(inv, rate, years);        // calculatorService

          return {
            ticker: ticker.toUpperCase(),
            futureValue: parseFloat(futureValue.toFixed(2)),
            rate: parseFloat(rate.toFixed(6)),
            beta: parseFloat(beta.toFixed(4)),
            expectedReturn: parseFloat(expectedReturn.toFixed(6)),
            riskFreeRate: RISK_FREE_RATE,
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