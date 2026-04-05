export function computeRate(beta, expectedReturn, riskFreeRate) {
  return riskFreeRate + beta * (expectedReturn - riskFreeRate);
}

export function computeFutureValue(principal, rate, years) {
  return principal * Math.pow(1 + rate, years);
}
