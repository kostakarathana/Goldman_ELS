/**
 * Mock data for the frontend mockup.
 * Will be replaced by real API calls to /mutual-funds and /future-value.
 */

export const MOCK_FUNDS = [
  { ticker: "VSMPX", fundName: "Vanguard Total Stock Market Index Institutional Plus", rank: 1 },
  { ticker: "FXAIX", fundName: "Fidelity 500 Index", rank: 2 },
  { ticker: "VFIAX", fundName: "Vanguard 500 Index Admiral", rank: 3 },
  { ticker: "FCNTX", fundName: "Fidelity Contrafund", rank: 4 },
  { ticker: "TRBCX", fundName: "T. Rowe Price Blue Chip Growth", rank: 5 },
  { ticker: "AGTHX", fundName: "American Funds Growth Fund of America", rank: 6 },
  { ticker: "LMGAX", fundName: "ClearBridge Large Cap Growth", rank: 7 },
  { ticker: "SNAXX", fundName: "Schwab Value Advantage Money Inv", rank: 8 },
];

export const MOCK_RESULT = {
  futureValue: 13208.49,
  rate: 0.0652,
  beta: 1.02,
  expectedReturn: 0.0843,
  riskFreeRate: 0.0425,
};
