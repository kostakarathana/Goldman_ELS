import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const fundsJson = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/funds.json")
  )
);

function inferCompany(name) {
  const providers = [
    "Vanguard",
    "Fidelity",
    "Schwab",
    "Goldman Sachs",
    "JPMorgan",
    "BlackRock",
    "State Street",
    "Morgan Stanley",
    "American Funds",
    "PIMCO",
    "T. Rowe Price",
    "ClearBridge",
  ];

  return providers.find((provider) => name.startsWith(provider)) || "Fund Sponsor";
}

function inferCategory(name) {
  if (/Money Market|Cash Reserves|FedFund|Treasury/i.test(name)) {
    return "Money Market";
  }
  if (/Bond|Income/i.test(name)) {
    return "Bond";
  }
  if (/International/i.test(name)) {
    return "International Equity";
  }
  if (/Growth|500|Index|Total Stock|Contrafund/i.test(name)) {
    return "US Equity";
  }

  return "Diversified";
}

// Demo branch: always serve the curated local list for a stable recording flow.
const localFunds = fundsJson.top_25_mutual_funds.map((fund) => ({
  ticker: fund.symbol,
  name: fund.fund_name,
  fund_type: "mutual_fund",
  category: inferCategory(fund.fund_name),
  company: inferCompany(fund.fund_name),
  is_active: true,
}));

export async function getAllFunds() {
  return localFunds;
}

export async function getFundByTicker(ticker) {
  return localFunds.find((fund) => fund.ticker === ticker.toUpperCase()) || null;
}
