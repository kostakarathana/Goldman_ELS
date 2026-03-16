import { readFileSync } from "fs";
import { join } from "path";

const fundsData = JSON.parse(
  readFileSync(join(process.cwd(), "server/data/funds.json"), "utf-8")
);

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json(fundsData.top_25_mutual_funds);
}
