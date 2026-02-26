/**
 * services/calculatorService.js
 * Core CAPM calculation logic.
 * r = riskFreeRate + beta * (expectedReturn - riskFreeRate)
 * futureValue = principal * (1 + r) ^ years
 */

/**
 * Compute the CAPM rate given inputs.
 * @param {number} beta
 * @param {number} expectedReturn
 * @param {number} riskFreeRate
 * @returns {number}
 */
export function computeRate(beta, expectedReturn, riskFreeRate) {
  return riskFreeRate + beta * (expectedReturn - riskFreeRate);
}

/**
 * Compute the future value of a principal using an annual rate and years.
 * @param {number} principal
 * @param {number} rate
 * @param {number} years
 * @returns {number}
 */
export function computeFutureValue(principal, rate, years) {
  return principal * Math.pow(1 + rate, years);
}
