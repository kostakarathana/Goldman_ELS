import express from "express";
import { getAllFunds, getFundByTicker } from "../services/fundService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rawFunds = await getAllFunds();
    const payload = rawFunds.map((fund, index) => ({
      rank: index + 1,
      symbol: fund.ticker,
      fund_name: fund.name,
      category: fund.category,
      company: fund.company,
      fund_type: fund.fund_type,
      is_active: fund.is_active,
    }));
    res.json(payload);
  } catch (err) {
    console.error("/api/funds error", err);
    res.status(500).json({ error: "failed to fetch funds" });
  }
});

router.get("/:ticker", async (req, res) => {
  try {
    const { ticker } = req.params;
    const fund = await getFundByTicker(ticker);

    if (!fund) {
      return res.status(404).json({ error: "Fund not found" });
    }

    const payload = {
      symbol: fund.ticker,
      fund_name: fund.name,
      category: fund.category,
      company: fund.company,
      fund_type: fund.fund_type,
      is_active: fund.is_active,
    };

    res.json(payload);
  } catch (err) {
    console.error(`/api/funds/${req.params.ticker} error`, err);
    res.status(500).json({ error: "failed to fetch fund" });
  }
});

export default router;