/**
 * services/returnService.js
 * Calculates the expected return rate from the last year
 * of historical data using Yahoo Finance (no API key required).
 * Formula from spec: (last price - first price) / first price
 */
import axios from "axios";

export async function getExpectedReturn(ticker) {
  const oneYearAgo = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000);
  const now = Math.floor(Date.now() / 1000);

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${oneYearAgo}&period2=${now}&interval=1mo`;
  const response = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const closes = response.data.chart.result[0].indicators.quote[0].close.filter(Boolean);
  const first = closes[0];
  const last = closes[closes.length - 1];

  return (last - first) / first;
}
