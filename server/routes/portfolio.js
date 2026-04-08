import express from "express";
import { getPortfolioSuggestion } from "../services/aiService.js";
import { getBeta } from "../services/betaService.js";
import { getExpectedReturn } from "../services/returnService.js";
import { computeRate } from "../services/calculatorService.js";

const router = express.Router();

const RISK_FREE_RATE = 0.0425;


router.post("/", async (req, res) => {
  const { tickers, riskTolerance, duration, investment } = req.body;

  if (!tickers || !riskTolerance || !duration || !investment) {
    return res.status(400).json({ error: "tickers, riskTolerance, duration, and investment are required" });
  }

  try {
    const raw = await getPortfolioSuggestion(tickers, riskTolerance, duration, investment);
    try {
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
      const parsed = JSON.parse(cleaned);

      const years = Number(duration);

      const calculateRate = async (ticker) => {
        try {
          const beta = await getBeta(ticker);
          const expectedReturn = await getExpectedReturn(ticker);
          return computeRate(beta, expectedReturn, RISK_FREE_RATE);
        } catch (err) {
          return RISK_FREE_RATE;
        }
      };

      const addEstValues = async (items) =>
        Promise.all(
          items
            .filter((item) => item.pct > 0)
            .map(async (item) => {
              const rate = await calculateRate(item.ticker);
              const allocated = (item.pct / 100) * investment;
              return {
                ...item,
                rate: Math.round(rate * 10000) / 100,
                estValue: Math.round(allocated * Math.pow(1 + rate, years)),
              };
            })
        );

      parsed.userAllocation = await addEstValues(parsed.userAllocation || []);
      parsed.gptRecommendation = await addEstValues(parsed.gptRecommendation || []);
      delete parsed.assumedReturnPct;
      delete parsed.assumedReturnExplanation;

      res.json({ suggestion: parsed });
    } catch {
      res.json({ suggestion: raw });
    }
  } catch (err) {
    console.error("/portfolio error", err);
    res.status(500).json({ error: "portfolio generation failed" });
  }
});

export default router;
