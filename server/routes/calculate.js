/**
 * routes/calculate.js
 * GET /future-value
 * Query params: ticker, investment, duration
 * Flow: frontend inputs → backend service → Newton API (beta) → CAPM calc → frontend result
 * Response: { futureValue, rate, beta, expectedReturn, riskFreeRate }
 */
