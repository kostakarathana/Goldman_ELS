/**
 * services/betaService.js
 * Fetches the beta value for a given mutual fund ticker
 * using the Newton Analytics API (no API key required).
 * URL from spec: https://api.newtonanalytics.com/stock-beta/?ticker=X&index=SPY&interval=1mo&observations=12
 */
import axios from "axios";

export async function getBeta(ticker) {
  const url = `https://api.newtonanalytics.com/stock-beta/?ticker=${ticker}&index=SPY&interval=1mo&observations=12`;
  const response = await axios.get(url);
  return Number(response.data.data);
}
