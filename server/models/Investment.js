/**
 * models/Investment.js
 * Database model for persisting saved investment calculations.
 * Stores ticker, principal, years, calculated future value, and timestamp.
 * (Bonus feature — DB persistence)
 */

import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const COOKIE_NAME = "anon_session_id";

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  const out = {};
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [rawKey, ...rawVal] = part.trim().split("=");
    if (!rawKey) continue;
    out[rawKey] = decodeURIComponent(rawVal.join("=") || "");
  }
  return out;
}

function isUuid(value) {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function getOrSetAnonSessionId(req, res) {
  const cookies = parseCookies(req.headers?.cookie);
  let sessionId = cookies[COOKIE_NAME];

  if (!isUuid(sessionId)) {
    sessionId = crypto.randomUUID();
    const isProd = process.env.NODE_ENV === "production";
    // SameSite=Lax works for same-origin + typical navigation; httpOnly prevents JS access.
    res.cookie(COOKIE_NAME, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
}

function getSupabaseForSession(sessionId) {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const SUPABASE_KEY =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase env vars for calculation history");
  }

  // Critical: pass session id as request header so RLS can enforce it for anon role.
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    global: {
      headers: {
        "x-session-id": sessionId,
      },
    },
  });
}

export async function insertCalculationHistory(sessionId, payload) {
  const supabase = getSupabaseForSession(sessionId);
  const { error } = await supabase.from("calculation_history").insert([
    {
      user_id: sessionId,
      fund_ticker: payload.fund_ticker,
      fund_name: payload.fund_name ?? null,
      principal: payload.principal,
      duration_days: payload.duration_days,
      future_value: payload.future_value,
    },
  ]);

  if (error) throw error;
}

export async function getFullCalculationHistory(sessionId) {
  const supabase = getSupabaseForSession(sessionId);
  const { data, error } = await supabase
    .from("calculation_history")
    .select(
      "id,user_id,fund_ticker,fund_name,principal,duration_days,future_value,created_at"
    )
    .eq("user_id", sessionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
