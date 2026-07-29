/**
 * Server-only Supabase client.
 *
 * Uses the secret key, which bypasses RLS — this module must never be imported
 * from a `"use client"` file. Every guest read and write goes through route
 * handlers and server components, so the browser never talks to Supabase and
 * the publishable key is not used anywhere in the app.
 *
 * Follows the `APPS_SCRIPT_URL` precedent: when the env vars are missing the
 * app stays honest and returns 503 NOT_CONFIGURED rather than crashing.
 */
import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db.types";

export type Db = SupabaseClient<Database>;

let cached: Db | null = null;

export const supabaseConfigured = (): boolean =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

/** Throws when unconfigured — callers should guard with `supabaseConfigured()`. */
export const supabaseAdmin = (): Db => {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SECRET_KEY ?? "";
  if (!url || !key) {
    throw new Error("Supabase is not configured: set SUPABASE_URL and SUPABASE_SECRET_KEY");
  }

  cached = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "nikah-web" } },
  });
  return cached;
};
