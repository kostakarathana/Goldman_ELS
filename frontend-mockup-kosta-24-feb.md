# frontend-mockup-kosta-24-feb

## Summary
Frontend mockup with mock data, styled after Marcus by Goldman Sachs.

## Files Changed

### New
- `client/` — Vite + React project (scaffolded from scratch)
- `client/src/data/mockData.js` — 8 hardcoded funds + mock CAPM result
- `client/src/components/Header.jsx` — GS logo, nav tabs, navy accent
- `client/src/components/Footer.jsx` — Links, disclaimer, copyright
- `client/src/components/FundSelector.jsx` — Fund dropdown
- `client/src/components/InvestmentForm.jsx` — Dollar input + duration slider (1–30yr)
- `client/src/components/ResultsDisplay.jsx` — 3-card result layout + CAPM details table
- `client/src/pages/Calculator.jsx` — Main page composing all components

### Modified
- `client/src/index.css` — Tailwind + GS theme (navy, gold, warm grays)
- `client/src/App.jsx` — Renders Header → Calculator → Footer
- `client/vite.config.js` — Added Tailwind plugin


### Removed
- `client/src/App.css` — Vite boilerplate

## Design
- Marcus-inspired: white cards on light background, serif headings, sans-serif body
- Slider for duration, `$` prefix on input, rounded cards
- Navy hero card for future value, green card for interest earned
- Disclaimer text matching GS tone

## Status
Mockup only — `handleCalculate` returns `MOCK_RESULT`. Swap to real `/future-value` API call when backend is ready.
