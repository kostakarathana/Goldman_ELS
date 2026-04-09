import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { supabase } from "../supabaseClient.js";

const fundsJson = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/funds.json")
  )
);

const localFunds = fundsJson.top_25_mutual_funds.map((f) => ({
  ticker: f.symbol,
  name: f.fund_name,
  fund_type: "mutual_fund",
  category: null,
  company: null,
  is_active: true,
}));

export async function getAllFunds() {
  if (!supabase) return localFunds;

  const { data, error } = await supabase
    .from("securities")
    .select("ticker, name, fund_type, category, company")
    .eq("is_active", true)
    .order("ticker", { ascending: true });

  if (error || !data?.length) return localFunds;
  return data;
}

export async function getFundByTicker(ticker) {
  if (!supabase) {
    return localFunds.find((f) => f.ticker === ticker.toUpperCase()) || null;
  }

  const { data, error } = await supabase
    .from("securities")
    .select("id, ticker, name, fund_type, category, company, is_active")
    .eq("ticker", ticker.toUpperCase())
    .single();

  if (error) return localFunds.find((f) => f.ticker === ticker.toUpperCase()) || null;
  return data || null;
}
