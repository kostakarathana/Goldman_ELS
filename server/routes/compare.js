import express from "express";
import { getExpectedReturn } from "../services/returnService.js";
import { getBeta } from "../services/betaService.js";
import { computeRate, computeFutureValue } from "../services/calculatorService.js";

const router = express.Router();

const RISK_FREE_RATE = 0.0425;

router.get("/", async (req, res) => {
  let { tickers, investment, duration } = req.query;

  if (!tickers || !investment || !duration) {
    return res.status(400).json({ error: "tickers[], investment, and duration are required" });
  }

  if (!Array.isArray(tickers)) tickers = [tickers];

  const inv = Number(investment);
  const dur = Number(duration);

  if (isNaN(inv) || isNaN(dur) || inv <= 0 || dur <= 0) {
    return res.status(400).json({ error: "investment and duration must be positive numbers" });
  }

  try {
    const results = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const years = dur / 365;
          const beta = await getBeta(ticker);
          const expectedReturn = await getExpectedReturn(ticker);
          const rate = computeRate(beta, expectedReturn, RISK_FREE_RATE);
          const futureValue = computeFutureValue(inv, rate, years);

          return {
            ticker: ticker.toUpperCase(),
            futureValue: parseFloat(futureValue.toFixed(2)),
            rate: parseFloat(rate.toFixed(6)),
            beta: parseFloat(beta.toFixed(4)),
            expectedReturn: parseFloat(expectedReturn.toFixed(6)),
            riskFreeRate: RISK_FREE_RATE,
          };
        } catch (err) {
          console.error(`Error processing ticker ${ticker}:`, err.message);
          return { ticker: ticker.toUpperCase(), error: `Could not retrieve data for ${ticker}` };
        }
      })
    );

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
