/**
 * services/betaService.js
 * Fetches the beta value for a given mutual fund ticker.
 * In a real implementation this would call the Newton Analytics
 * API (or another financial data provider). For now we return
 * a hard‑coded value.
 */

export async function getBeta(ticker) {
  // TODO: replace with real HTTP call when API key available
  // e.g. `const resp = await fetch(`https://api.newtonanalytics.com/stock-beta/${ticker}`);
  //       const json = await resp.json();
  //       return json.beta;
  console.log(`betaService.getBeta(${ticker})`);
  return 1.02; // stub
}
