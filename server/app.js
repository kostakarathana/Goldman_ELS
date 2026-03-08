/**
 * app.js
 * Express server entry point.
 * Configures middleware, mounts routes, and starts the HTTP server.
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import fundsRouter from "./routes/funds.js";
import calculateRouter from "./routes/calculate.js";
import portfolioRouter from "./routes/portfolio.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/funds", fundsRouter);
app.use("/api", calculateRouter);
app.use("/api/portfolio", portfolioRouter);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
