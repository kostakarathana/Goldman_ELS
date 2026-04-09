import { FALLBACK_FUNDS, getFallbackFundByTicker } from "../data/mockData";

const BASE_URL = "/api";

export async function getFunds() {
  try {
    const res = await fetch(`${BASE_URL}/funds`);
    if (!res.ok) throw new Error("Failed to fetch funds");

    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_FUNDS;
  } catch {
    return FALLBACK_FUNDS;
  }
}

export async function getFundByTicker(ticker) {
  try {
    const res = await fetch(`${BASE_URL}/funds/${ticker}`);
    if (!res.ok) throw new Error("Failed to fetch fund");
    return res.json();
  } catch {
    const fallbackFund = getFallbackFundByTicker(ticker);
    if (fallbackFund) return fallbackFund;
    throw new Error("Failed to fetch fund");
  }
}

export async function getFutureValue(ticker, investment, duration) {
  const params = new URLSearchParams({ ticker, investment, duration });
  const res = await fetch(`${BASE_URL}/future-value?${params}`);
  if (!res.ok) throw new Error("Calculation failed");
  return res.json();
}

export async function compareFunds(tickers, investment, duration) {
  const params = new URLSearchParams({ investment, duration });
  tickers.forEach((t) => params.append("tickers", t));
  const res = await fetch(`${BASE_URL}/compare?${params}`);
  if (!res.ok) throw new Error("Comparison failed");
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
