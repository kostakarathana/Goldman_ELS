import { readFileSync } from "fs";
import { join } from "path";

const RISK_FREE_RATE = 0.0425;

const fundsData = JSON.parse(
  readFileSync(join(process.cwd(), "server/data/funds.json"), "utf-8")
);

async function getBeta(ticker) {
  const url = `https://api.newtonanalytics.com/stock-beta/?ticker=${encodeURIComponent(ticker)}&index=%5EGSPC&interval=1mo&observations=12`;
  const res = await fetch(url);
  const data = await res.json();
  return Number(data.data);
}

async function getExpectedReturn(ticker) {
  const oneYearAgo = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000);
  const now = Math.floor(Date.now() / 1000);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${oneYearAgo}&period2=${now}&interval=1mo`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const data = await res.json();
  const closes = data.chart.result[0].indicators.quote[0].close.filter(Boolean);
  return (closes[closes.length - 1] - closes[0]) / closes[0];
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { ticker, investment, duration } = req.query;
  if (!ticker || !investment || !duration) {
    return res.status(400).json({ error: "ticker, investment and duration are required" });
  }

  try {
    const beta = await getBeta(ticker);
    const expectedReturn = await getExpectedReturn(ticker);
    const rate = RISK_FREE_RATE + beta * (expectedReturn - RISK_FREE_RATE);
    const years = Number(duration) / 365;
    const futureValue = Number(investment) * Math.pow(1 + rate, years);

    const fund = fundsData.top_25_mutual_funds.find(
      (f) => f.symbol.toUpperCase() === ticker.toUpperCase()
    );
    const fundName = fund ? fund.fund_name : ticker;

    res.json({ futureValue, rate, beta, expectedReturn, riskFreeRate: RISK_FREE_RATE, fundName });
  } catch (err) {
    console.error("/api/future-value error", err);
    res.status(500).json({ error: "calculation failed" });
  }
}
