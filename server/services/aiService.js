import OpenAI from "openai";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const fundsData = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/funds.json")
  )
);
const allFunds = fundsData.top_25_mutual_funds
  .map((f) => `${f.symbol} (${f.fund_name})`)
  .join(", ");

// Hardcoded CAPM rates for the 25 known funds — used by the portfolio calculator.
// The main calculator fetches live rates from Newton Analytics instead.
export const FUND_RATE_HINTS = {
  VSMPX: 12.3, FXAIX: 12.9, VFIAX: 12.2, VTSAX: 12.3, VIIIX: 12.2, FCTDX: 12.3,
  AGTHX: 14.0, FCNTX: 13.5,
  VGTSX: 2.1,
  VTBNX: 4.7, VTBIX: 4.7, PIMIX: 6.0,
  SPAXX: 5.0, VMFXX: 5.0, SWVXX: 5.0, FDRXX: 5.0, FGTXX: 5.0,
  OGVXX: 5.0, FRGXX: 5.0, MVRXX: 5.0, TFDXX: 5.0, GVMXX: 5.0,
  CJTTX: 5.0, TTTXX: 5.0, SNAXX: 5.0,
};

export async function getPortfolioSuggestion(tickers, riskTolerance, duration, investment) {
  if (!process.env.OPENAI_API_KEY) {
    return getMockSuggestion(tickers, riskTolerance, duration, investment);
  }

  const userFundsSummary = tickers
    .map((t) => `${t} (approx. annual return: ${FUND_RATE_HINTS[t] != null ? FUND_RATE_HINTS[t] + "%" : "unknown"})`)
    .join(", ");

  const riskLabel = riskTolerance <= 3 ? "conservative" : riskTolerance <= 6 ? "moderate" : "aggressive";

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are a financial advisor. A user wants to invest $${investment} for ${duration} years with a ${riskLabel} risk tolerance (${riskTolerance}/10).

Available funds: ${allFunds}

User selected (with their real CAPM rates): ${userFundsSummary}

Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "userAllocation": [
    { "ticker": "TICKER", "pct": 50, "rationale": "one sentence" }
  ],
  "gptRecommendation": [
    { "ticker": "TICKER", "pct": 50, "rationale": "one sentence" }
  ],
  "recommendationReasoning": "For each fund you picked, one sentence explaining exactly why it was chosen or why it replaces a fund from the user's selection — mention the specific ticker being replaced if applicable (e.g. 'VTSAX replaces SPAXX because...'). End with one sentence on the overall strategy."
}

Rules:
- userAllocation: optimized weights for the user's selected funds only, percentages must sum to 100
- gptRecommendation: 2-3 picks from the available funds list that best match this risk profile — for aggressive investors prefer high-growth equity funds, for conservative investors prefer bonds/stable funds; percentages must sum to 100
- If the user's selected funds are misaligned with their risk tolerance (e.g. risky person chose safe funds, or safe person chose volatile funds), your recommendation should correct that and explain why in recommendationReasoning
- Do NOT include estValue or any return rates — those will be calculated from real market data separately`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

function getMockSuggestion(tickers, riskTolerance, duration, investment) {
  const isHighRisk = riskTolerance >= 7;
  const allocations = tickers.map((ticker, i) => {
    const weight = i === 0 ? 40 : Math.floor(60 / (tickers.length - 1));
    return `• ${ticker}: ${weight}% — ${isHighRisk ? "growth-oriented" : "conservative"} allocation suitable for a ${duration}-year horizon`;
  });

  return `Based on your $${investment} investment, ${duration}-year horizon, and risk tolerance of ${riskTolerance}/10:\n\n${allocations.join("\n")}\n\n${isHighRisk ? "Your higher risk tolerance allows for equity-heavy positioning." : "Your lower risk tolerance suggests a more balanced approach."}\n\n(Mock response — add OPENAI_API_KEY to server/.env for real AI suggestions.)`;
}
