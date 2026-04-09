import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.VERCEL) {
  config({ path: path.resolve(__dirname, ".env.local") });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  const missing = [
    SUPABASE_URL ? null : "VITE_SUPABASE_URL/SUPABASE_URL",
    SUPABASE_KEY ? null : "VITE_SUPABASE_PUBLISHABLE_KEY/SUPABASE_KEY",
  ].filter(Boolean);

  throw new Error(
    `Missing Supabase configuration: ${missing.join(" and ")}. ` +
      "For local development, add them to server/.env.local. For Vercel, set them in project environment variables."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
