import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "path";

// Only try to load .env.local if we are NOT on Vercel
if (!process.env.VERCEL) {
  config({ path: path.resolve(process.cwd(), ".env.local") });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

export const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;
