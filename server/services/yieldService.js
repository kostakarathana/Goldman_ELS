import axios from "axios";

export async function getFundYield(ticker) {
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=summaryDetail`;
  const response = await axios.get(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 8000 });
  const detail = response.data.quoteSummary.result[0].summaryDetail;
  const yieldVal = detail.yield?.raw ?? detail.dividendYield?.raw;
  if (yieldVal == null) throw new Error(`No yield data for ${ticker}`);
  return yieldVal;
}
