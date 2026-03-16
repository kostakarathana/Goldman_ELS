function getMockSuggestion(tickers, riskTolerance, duration, investment) {
  const isHighRisk = riskTolerance >= 7;
  const allocations = tickers.map((ticker, i) => {
    const weight = i === 0 ? 40 : Math.floor(60 / (tickers.length - 1));
    return `• ${ticker}: ${weight}% — ${isHighRisk ? "growth-oriented allocation" : "conservative allocation"} suitable for a ${duration}-year horizon`;
  });

  return `Based on your $${investment} investment, ${duration}-year horizon, and risk tolerance of ${riskTolerance}/10, here is a suggested allocation:\n\n${allocations.join("\n")}\n\n${isHighRisk ? "Your higher risk tolerance allows for equity-heavy positioning." : "Your lower risk tolerance suggests a more balanced approach."}\n\n(Mock response — add OPENAI_API_KEY env var for real AI suggestions.)`;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tickers, riskTolerance, duration, investment } = req.body;

  if (!tickers || !riskTolerance || !duration || !investment) {
    return res.status(400).json({ error: "tickers, riskTolerance, duration, and investment are required" });
  }

  try {
    let suggestion;

    if (process.env.OPENAI_API_KEY) {
      const { default: OpenAI } = await import("openai");
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const prompt = `You are a financial advisor. A user wants to invest $${investment} for ${duration} years with a risk tolerance of ${riskTolerance}/10. They are considering these mutual funds: ${tickers.join(", ")}. Suggest an optimized portfolio allocation with percentages and a brief rationale for each fund.`;

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });
      suggestion = response.choices[0].message.content;
    } else {
      suggestion = getMockSuggestion(tickers, riskTolerance, duration, investment);
    }

    res.json({ suggestion });
  } catch (err) {
    console.error("/api/portfolio error", err);
    res.status(500).json({ error: "portfolio generation failed" });
  }
}
