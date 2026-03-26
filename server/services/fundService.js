import { supabase } from "../supabaseClient.js";

/**
 * Returns all active securities, with optional limit.
 */
export async function getAllFunds() {
  const { data, error } = await supabase
    .from("securities")
    .select("ticker, name, fund_type, category, company")
    .eq("is_active", true)
    .order("ticker", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getFundByTicker(ticker) {
  const { data, error } = await supabase
    .from("securities")
    .select("id, ticker, name, fund_type, category, company, is_active")
    .eq("ticker", ticker.toUpperCase())
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116: no rows found
    throw error;
  }

  return data || null;
}
