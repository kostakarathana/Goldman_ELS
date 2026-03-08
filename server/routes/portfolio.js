/**
 * routes/portfolio.js
 * POST /api/portfolio
 * Accepts tickers, riskTolerance, duration, and investment.
 * Uses OpenAI to generate an optimized portfolio suggestion.
 * (Bonus feature — AI Challenge)
 */
import express from "express";
import { getPortfolioSuggestion } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { tickers, riskTolerance, duration, investment } = req.body;

  if (!tickers || !riskTolerance || !duration || !investment) {
    return res.status(400).json({ error: "tickers, riskTolerance, duration, and investment are required" });
  }

  try {
    const suggestion = await getPortfolioSuggestion(tickers, riskTolerance, duration, investment);
    res.json({ suggestion });
  } catch (err) {
    console.error("/portfolio error", err);
    res.status(500).json({ error: "portfolio generation failed" });
  }
});

export default router;

