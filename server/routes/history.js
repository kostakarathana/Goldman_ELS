import express from "express";
import { getOrSetAnonSessionId, getFullCalculationHistory } from "../models/Investment.js";

const router = express.Router();

// Dedicated GET endpoint: returns the user's full calculation history (anon session based)
router.get("/history", async (req, res) => {
  try {
    const sessionId = getOrSetAnonSessionId(req, res);
    const history = await getFullCalculationHistory(sessionId);
    res.json({ sessionId, history });
  } catch (err) {
    console.error("/api/history error", err);
    res.status(500).json({ error: "failed to fetch calculation history" });
  }
});

export default router;

