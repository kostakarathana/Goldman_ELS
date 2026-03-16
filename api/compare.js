const RISK_FREE_RATE = 0.0425;

async function getBeta(ticker) {
  const url = `https://api.newtonanalytics.com/stock-beta/?ticker=${encodeURIComponent(ticker)}&index=%5EGSPC&interval=1mo&observations=12`;
  const res = await fetch(url);
  const data = await res.json();
  return Number(data.data);
}

async function getExpectedReturn(ticker) {
  const oneYearAgo = Math.floor((Date.now() - 365 * 24 * 60 * 60 * 1000) / 1000);
  const now = Math.floor(Date.now() / 1000);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${oneYearAgo}&period2=${now}&interval=1mo`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const data = await res.json();
  const closes = data.chart.result[0].indicators.quote[0].close.filter(Boolean);
  return (closes[closes.length - 1] - closes[0]) / closes[0];
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  let { tickers, investment, duration } = req.query;

  if (!tickers || !investment || !duration) {
    return res.status(400).json({ error: "tickers[], investment, and duration are required" });
  }

  if (!Array.isArray(tickers)) {
    tickers = [tickers];
  }

  const inv = Number(investment);
  const dur = Number(duration);

  if (isNaN(inv) || isNaN(dur) || inv <= 0 || dur <= 0) {
    return res.status(400).json({ error: "investment and duration must be positive numbers" });
  }

  try {
    const results = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const beta = await getBeta(ticker);
          const expectedReturn = await getExpectedReturn(ticker);
          const rate = RISK_FREE_RATE + beta * (expectedReturn - RISK_FREE_RATE);
          const years = dur / 365;
          const futureValue = inv * Math.pow(1 + rate, years);

          return {
            ticker: ticker.toUpperCase(),
            futureValue: parseFloat(futureValue.toFixed(2)),
            rate: parseFloat(rate.toFixed(6)),
            beta: parseFloat(beta.toFixed(4)),
            expectedReturn: parseFloat(expectedReturn.toFixed(6)),
            riskFreeRate: RISK_FREE_RATE,
          };
        } catch (err) {
          console.error(`Error processing ticker ${ticker}:`, err.message);
          return { ticker: ticker.toUpperCase(), error: `Could not retrieve data for ${ticker}` };
        }
      })
    );

    results.sort((a, b) => {
      if (a.error) return 1;
      if (b.error) return -1;
      return b.futureValue - a.futureValue;
    });

    res.json(results);
  } catch (err) {
    console.error("/api/compare error", err);
    res.status(500).json({ error: "comparison failed" });
  }
}
