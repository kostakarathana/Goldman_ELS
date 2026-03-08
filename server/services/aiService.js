/**
 * services/aiService.js
 * Integrates with the OpenAI API to generate optimized
 * portfolio suggestions based on user inputs.
 * (Bonus feature — AI Challenge)
 */
import OpenAI from "openai";

/**
 * Generate a portfolio suggestion given user inputs.
 * @param {string[]} tickers
 * @param {number} riskTolerance  1–10 scale
 * @param {number} duration       years
 * @param {number} investment     initial amount in USD
 * @returns {Promise<string>}
 */
export async function getPortfolioSuggestion(tickers, riskTolerance, duration, investment) {
  if (!process.env.OPENAI_API_KEY) {
    return getMockSuggestion(tickers, riskTolerance, duration, investment);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are a financial advisor. A user wants to invest $${investment} for ${duration} years with a risk tolerance of ${riskTolerance}/10. They are considering these mutual funds: ${tickers.join(", ")}. Suggest an optimized portfolio allocation with percentages and a brief rationale for each fund.`;

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
    return `• ${ticker}: ${weight}% — ${isHighRisk ? "growth-oriented allocation" : "conservative allocation"} suitable for a ${duration}-year horizon`;
  });

  return `Based on your $${investment} investment, ${duration}-year horizon, and risk tolerance of ${riskTolerance}/10, here is a suggested allocation:\n\n${allocations.join("\n")}\n\n${isHighRisk ? "Your higher risk tolerance allows for equity-heavy positioning." : "Your lower risk tolerance suggests a more balanced approach."}\n\n(Mock response — add OPENAI_API_KEY to server/.env for real AI suggestions.)`;
}
