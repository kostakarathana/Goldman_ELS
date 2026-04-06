/**
 * models/investment.js
 * Database model for persisting saved investment calculations.
 * Stores ticker, principal, years, calculated future value, rate, beta, and timestamp.
 * (Bonus feature — DB persistence)
 */

import { supabase } from "../supabaseClient.js";

/**
 * Save a new investment calculation to the database.
 * @param {Object} investmentData - Investment calculation data
 * @param {string} investmentData.ticker - Fund ticker symbol
 * @param {string} investmentData.fundName - Fund name
 * @param {number} investmentData.principal - Initial investment amount
 * @param {number} investmentData.years - Investment duration in years
 * @param {number} investmentData.futureValue - Calculated future value
 * @param {number} investmentData.rate - Calculated return rate
 * @param {number} investmentData.beta - Fund beta
 * @param {number} investmentData.expectedReturn - Expected annual return
 * @param {number} investmentData.riskFreeRate - Risk-free rate used in calculation
 * @returns {Promise<Object>} Saved investment record with ID
 */
export async function saveInvestment(investmentData) {
  const { data, error } = await supabase
    .from("investmentHistory")
    .insert([
      {
        ticker: investmentData.ticker,
        fund_name: investmentData.fundName,
        principal: investmentData.principal,
        years: investmentData.years,
        future_value: investmentData.futureValue,
        rate: investmentData.rate,
        beta: investmentData.beta,
        expected_return: investmentData.expectedReturn,
        risk_free_rate: investmentData.riskFreeRate,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    throw new Error(`Failed to save investment: ${error.message}`);
  }

  return data[0];
}

/**
 * Retrieve all saved investments.
 * @returns {Promise<Array>} Array of investment records
 */
export async function getAllInvestments() {
  const { data, error } = await supabase
    .from("investmentHistory")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch investments: ${error.message}`);
  }

  return data;
}

/**
 * Retrieve a specific investment by ID.
 * @param {string} id - Investment record ID
 * @returns {Promise<Object>} Investment record
 */
export async function getInvestmentById(id) {
  const { data, error } = await supabase
    .from("investmentHistory")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch investment: ${error.message}`);
  }

  return data;
}

/**
 * Update an existing investment record.
 * @param {string} id - Investment record ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated investment record
 */
export async function updateInvestment(id, updates) {
  const { data, error } = await supabase
    .from("investmentHistory")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(`Failed to update investment: ${error.message}`);
  }

  return data[0];
}

/**
 * Delete an investment record.
 * @param {string} id - Investment record ID
 * @returns {Promise<void>}
 */
export async function deleteInvestment(id) {
  const { error } = await supabase.from("investmentHistory").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete investment: ${error.message}`);
  }
}

/**
 * Get investments filtered by ticker symbol.
 * @param {string} ticker - Fund ticker symbol
 * @returns {Promise<Array>} Array of investment records for the ticker
 */
export async function getInvestmentsByTicker(ticker) {
  const { data, error } = await supabase
    .from("investmentHistory")
    .select("*")
    .eq("ticker", ticker)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch investments by ticker: ${error.message}`);
  }

  return data;
}

