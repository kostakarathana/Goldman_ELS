/**
 * services/calculatorService.js
 * Core CAPM calculation logic.
 * r = riskFreeRate + beta * (expectedReturn - riskFreeRate)
 * futureValue = principal * (1 + r) ^ t
 */

export function computeRate(beta, expectedReturn, riskFreeRate) {
  return riskFreeRate + beta * (expectedReturn - riskFreeRate);
}

export function computeFutureValue(principal, rate, years) {
  return principal * Math.pow(1 + rate, years);
}
