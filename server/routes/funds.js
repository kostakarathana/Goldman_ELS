import express from "express";
import fs from "fs";

const router = express.Router();
const fundsData = JSON.parse(fs.readFileSync(new URL("../data/funds.json", import.meta.url)));

router.get("/", (_req, res) => {
  res.json(fundsData.top_25_mutual_funds);
});

export default router;
