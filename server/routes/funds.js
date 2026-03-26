/**
 * routes/funds.js
 * GET /api/funds
 * Returns the list of available mutual funds.
 */
import express from "express";
import { getAllFunds } from "../services/fundService.js";

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

export default router;
