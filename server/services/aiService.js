import OpenAI from "openai";
import { getAllFunds } from "./fundService.js";
import { getBeta } from "./betaService.js";
import { getExpectedReturn } from "./returnService.js";
import { computeRate } from "./calculatorService.js";

const RISK_FREE_RATE = 0.0425;

export async function getPortfolioSuggestion(tickers, riskTolerance, duration, investment) {
  if (!process.env.OPENAI_API_KEY) {
    return getMockSuggestion(tickers, riskTolerance, duration, investment);
  }

  // Fetch all available funds from the database
  const allFundsData = await getAllFunds();
  const allFunds = allFundsData
    .map((f) => `${f.ticker} (${f.name})`)
    .join(", ");

  const selectedRates = await Promise.all(
    tickers.map(async (ticker) => {
      try {
        const beta = await getBeta(ticker);
        const expectedReturn = await getExpectedReturn(ticker);
        const rate = computeRate(beta, expectedReturn, RISK_FREE_RATE);
        return { ticker: ticker.toUpperCase(), rate: rate * 100 };
      } catch (err) {
        return { ticker: ticker.toUpperCase(), rate: null };
      }
    })
  );

  const userFundsSummary = selectedRates
    .map(({ ticker, rate }) => {
      const formattedRate = rate != null ? `${rate.toFixed(1)}%` : "unknown";
      return `${ticker} (approx. annual return: ${formattedRate})`;
    })
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
