const BASE_URL = "/api";

export async function getFunds() {
  const res = await fetch(`${BASE_URL}/funds`);
  if (!res.ok) throw new Error("Failed to fetch funds");
  return res.json();
}

export async function getFutureValue(ticker, investment, duration) {
  const params = new URLSearchParams({ ticker, investment, duration });
  const res = await fetch(`${BASE_URL}/future-value?${params}`);
  if (!res.ok) throw new Error("Calculation failed");
  return res.json();
}

export async function getPortfolioSuggestion({
  tickers,
  riskTolerance,
  duration,
  investment,
}) {
  const res = await fetch(`${BASE_URL}/portfolio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tickers,
      riskTolerance,
      duration,
      investment,
    }),
  });

  if (!res.ok) {
    throw new Error("Portfolio generation failed");
  }

  return res.json();
}
