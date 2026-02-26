/**
 * app.js
 * Express server entry point.
 * Configures middleware, mounts routes, and starts the HTTP server.
 */
import express from "express";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

const fundsData = JSON.parse(
  fs.readFileSync(new URL("./data/funds.json", import.meta.url))
);

// simple API endpoint returning the array of funds
app.get("/api/funds", (req, res) => {
  // we return the array directly, client can map as needed
  res.json(fundsData.top_25_mutual_funds);
});



// start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
