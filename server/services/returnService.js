/**
 * services/returnService.js
 * Calculates the expected return rate from the last year
 * of historical data for a given mutual fund.
 * Here we also return a stubbed constant; real logic would
 * pull historical price information and compute the return.
 */

export async function getExpectedReturn(ticker) {
  console.log(`returnService.getExpectedReturn(${ticker})`);
  return 0.0843; // stub value matching earlier UI mock
}
