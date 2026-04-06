# Mutual Fund Calculator

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express |
| APIs | Newton Analytics (beta), FRED (risk-free rate) |

## Project Structure

```
client/                          # React frontend
├── src/
│   ├── components/
│   │   ├── FundSelector.jsx         Dropdown to pick a fund
│   │   ├── InvestmentForm.jsx       Amount & duration inputs
│   │   ├── ResultsDisplay.jsx       Future value output
│   │   ├── ComparisonTable.jsx      Multi-fund comparison (bonus)
│   │   └── PerformanceChart.jsx     Historical charts (bonus)
│   ├── pages/
│   │   ├── Calculator.jsx           Main calculator page
│   │   ├── Compare.jsx              Side-by-side comparison (bonus)
│   │   └── Portfolio.jsx            AI portfolio optimizer (bonus)
│   └── services/
│       └── api.js                   Backend API calls

server/                          # Express backend
├── routes/
│   ├── funds.js                     GET /mutual-funds
│   ├── calculate.js                 GET /future-value
│   ├── compare.js                   GET /compare (bonus)
│   └── portfolio.js                 POST /portfolio (bonus)
├── services/
│   ├── betaService.js               Newton Analytics API
│   ├── returnService.js             Historical return calc
│   ├── calculatorService.js         CAPM math
│   └── aiService.js                 OpenAI integration (bonus)
├── data/
│   └── funds.json                   Hardcoded fund list
└── models/
    └── Investment.js                DB model (bonus)
```

## CAPM Formula

```
r = riskFreeRate + beta × (expectedReturn − riskFreeRate)
futureValue = principal × (1 + r)^years
```

## Database support (Supabase)

The backend now uses Supabase `securities` table instead of `data/funds.json`.

Required environment variables (add in `server/.env`):

- `SUPABASE_URL` (your Supabase project URL)
- `SUPABASE_KEY` (service role or anon key, ideally service-role key for server-side)

Then run:

```bash
cd server
npm install
npm start
```

## API Endpoints

### GET `/api/funds`
Returns active securities mapped into fund format.

**Response:**
```json
[
  { "ticker": "VSMPX", "fundName": "Vanguard Total Stock Mkt Idx Instl Pl", "rank": 1 },
  { "ticker": "FXAIX", "fundName": "Fidelity 500 Index", "rank": 2 }
]
```

### GET `/future-value`
Calculates predicted future value of an investment.

**Query Params:** `ticker`, `investment`, `duration`

**Flow:** frontend inputs → backend service → Newton API (beta) → CAPM calc → frontend result

**Response:**
```json
{
  "futureValue": 13200.50,
  "rate": 0.065,
  "beta": 1.02,
  "expectedReturn": 0.08,
  "riskFreeRate": 0.0425
}
```

### GET `/compare` (bonus)
Compare multiple funds. Params: `tickers[]`, `investment`, `duration`

### POST `/portfolio` (bonus)
AI portfolio optimization. Body: `tickers[]`, `riskTolerance`, `duration`, `investment`


## Bonus Features

- Multi-fund comparison
- Historical performance charts (Recharts)
- AI portfolio optimization (OpenAI)
- Database persistence (SQLite/PostgreSQL)
- Unit tests (Jest)
- ETF support