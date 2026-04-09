const RAW_FUNDS = [
  { symbol: "VSMPX", fund_name: "Vanguard Total Stock Market Index Fund;Institutional Plus" },
  { symbol: "FXAIX", fund_name: "Fidelity 500 Index Fund" },
  { symbol: "VFIAX", fund_name: "Vanguard 500 Index Fund;Admiral" },
  { symbol: "VTSAX", fund_name: "Vanguard Total Stock Market Index Fund;Admiral" },
  { symbol: "SPAXX", fund_name: "Fidelity Government Money Market Fund" },
  { symbol: "VMFXX", fund_name: "Vanguard Federal Money Market Fund;Investor" },
  { symbol: "VGTSX", fund_name: "Vanguard Total International Stock Index Fund;Investor" },
  { symbol: "SWVXX", fund_name: "Schwab Prime Advantage Money Fund;Inv" },
  { symbol: "FDRXX", fund_name: "Fidelity Government Cash Reserves" },
  { symbol: "FGTXX", fund_name: "Goldman Sachs FS Government Fund;Institutional" },
  { symbol: "OGVXX", fund_name: "JPMorgan US Government Money Market Fund;Capital" },
  { symbol: "FCTDX", fund_name: "Fidelity Strategic Advisers Fidelity US Total Stk" },
  { symbol: "VIIIX", fund_name: "Vanguard Institutional Index Fund;Inst Plus" },
  { symbol: "FRGXX", fund_name: "Fidelity Instl Government Portfolio;Institutional" },
  { symbol: "VTBNX", fund_name: "Vanguard Total Bond Market II Index Fund;Institutional" },
  { symbol: "MVRXX", fund_name: "Morgan Stanley Inst Liq Government Port;Institutional" },
  { symbol: "TFDXX", fund_name: "BlackRock Liquidity FedFund;Institutional" },
  { symbol: "GVMXX", fund_name: "State Street US Government Money Market Fund;Prem" },
  { symbol: "AGTHX", fund_name: "American Funds Growth Fund of America;A" },
  { symbol: "VTBIX", fund_name: "Vanguard Total Bond Market II Index Fund;Investor" },
  { symbol: "CJTTX", fund_name: "JPMorgan 100% US Treasury Securities Money Market Fund;Capital" },
  { symbol: "TTTXX", fund_name: "BlackRock Liquidity Treasury Trust Fund;Institutional" },
  { symbol: "FCNTX", fund_name: "Fidelity Contrafund" },
  { symbol: "SNAXX", fund_name: "Schwab Prime Advantage Money Fund;Ultra" },
  { symbol: "PIMIX", fund_name: "PIMCO Income Fund;Institutional" },
];

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

export const FALLBACK_FUNDS = RAW_FUNDS.map((fund, index) => ({
  rank: index + 1,
  symbol: fund.symbol,
  fund_name: fund.fund_name,
  category: inferCategory(fund.fund_name),
  company: inferCompany(fund.fund_name),
  fund_type: "mutual_fund",
  is_active: true,
}));

export function getFallbackFundByTicker(ticker) {
  return FALLBACK_FUNDS.find((fund) => fund.symbol === ticker.toUpperCase()) || null;
}

export const MOCK_FUNDS = FALLBACK_FUNDS.map((fund) => ({
  ticker: fund.symbol,
  fundName: fund.fund_name,
  rank: fund.rank,
}));

export const MOCK_RESULT = {
  futureValue: 13208.49,
  rate: 0.0652,
  beta: 1.02,
  expectedReturn: 0.0843,
  riskFreeRate: 0.0425,
};
