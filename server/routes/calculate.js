import express from "express";
import fs from "fs";
import { computeRate, computeFutureValue } from "../services/calculatorService.js";
import { getBeta } from "../services/betaService.js";
import { getExpectedReturn } from "../services/returnService.js";
import { getFundYield } from "../services/yieldService.js";

const router = express.Router();

const fundsData = JSON.parse(
  fs.readFileSync(new URL("../data/funds.json", import.meta.url))
);

const RISK_FREE_RATE = 0.0425;

router.get("/future-value", async (req, res) => {
  const { ticker, investment, duration } = req.query;
  if (!ticker || !investment || !duration) {
    return res.status(400).json({ error: "ticker, investment and duration are required" });
  }

  try {
    const years = Number(duration) / 365;
    const fund = fundsData.top_25_mutual_funds.find(
      (f) => f.symbol.toUpperCase() === ticker.toUpperCase()
    );
    const fundName = fund ? fund.fund_name : ticker;

    const beta = await getBeta(ticker);
    let rate, expectedReturn, futureValue, method;

    if (beta !== null) {
      expectedReturn = await getExpectedReturn(ticker);
      rate = computeRate(beta, expectedReturn, RISK_FREE_RATE);
      futureValue = computeFutureValue(Number(investment), rate, years);
      method = "capm";
    } else {
      rate = await getFundYield(ticker);
      futureValue = computeFutureValue(Number(investment), rate, years);
      expectedReturn = rate;
      method = "yield";
    }

    res.json({ futureValue, rate, beta, expectedReturn, riskFreeRate: RISK_FREE_RATE, fundName, method });
  } catch (err) {
    console.error("/future-value error", err);
    res.status(500).json({ error: "calculation failed" });
  }
});

export default router;
