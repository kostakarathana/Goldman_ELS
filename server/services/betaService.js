import axios from "axios";

export async function getBeta(ticker) {
  const url = `https://api.newtonanalytics.com/stock-beta/?ticker=${encodeURIComponent(ticker)}&index=%5EGSPC&interval=1mo&observations=12`;
  const response = await axios.get(url, { timeout: 8000 });
  const val = Number(response.data.data);
  return isNaN(val) ? 0 : val;
}
