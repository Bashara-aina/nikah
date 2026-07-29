import "server-only";

import { supabaseAdmin, supabaseConfigured } from "./supabaseAdmin";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const LOGIN_WINDOW_MS = 15 * 60_000;
const LOGIN_MAX = 10;
const LOGIN_RETENTION_MS = 7 * 24 * 60 * 60_000;

const hits = new Map<string, number[]>();
const localLoginFailures = new Map<string, number[]>();

const activeHits = (values: number[], now: number, windowMs: number): number[] =>
  values.filter((value) => now - value < windowMs);

export const rateLimited = (
  scope: string,
  ip: string,
  max = MAX_PER_WINDOW,
  windowMs = WINDOW_MS,
): boolean => {
  const now = Date.now();
  const key = `${scope}:${ip}`;
  const list = activeHits(hits.get(key) ?? [], now, windowMs);
  if (list.length >= max) {
    hits.set(key, list);
    return true;
  }
  list.push(now);
  hits.set(key, list);
  return false;
};

export const clientIp = (req: Request): string =>
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  req.headers.get("x-real-ip")?.trim() ||
  "unknown";

/**
 * The durable limiter lives in Postgres so it survives serverless instances,
 * but it must never become a way to lock the couple out of their own dashboard.
 * If `auth_attempts` is unreachable — most likely because migration 0002 has
 * not been run yet — these fall back to the in-memory counter and log loudly.
 * That is weaker than the database path, never weaker than no limiter at all,
 * and it fails towards "you can still sign in" rather than "nobody can".
 */
const localLoginLimited = (ip: string): boolean => {
  const list = activeHits(localLoginFailures.get(ip) ?? [], Date.now(), LOGIN_WINDOW_MS);
  localLoginFailures.set(ip, list);
  return list.length >= LOGIN_MAX;
};

const localRecordFailure = (ip: string): void => {
  const now = Date.now();
  const list = activeHits(localLoginFailures.get(ip) ?? [], now, LOGIN_WINDOW_MS);
  list.push(now);
  localLoginFailures.set(ip, list);
};

const degrade = (operation: string, detail: string): void => {
  console.error(
    `auth_attempts ${operation} failed (${detail}) — falling back to the in-memory login limiter. Run supabase/migrations/0002_tracking_and_dedupe.sql.`,
  );
};

export const loginRateLimited = async (ip: string): Promise<boolean> => {
  if (!supabaseConfigured()) return localLoginLimited(ip);

  const { count, error } = await supabaseAdmin()
    .from("auth_attempts")
    .select("ip", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("attempted_at", new Date(Date.now() - LOGIN_WINDOW_MS).toISOString());
  if (error) {
    degrade("count", error.message);
    return localLoginLimited(ip);
  }
  return (count ?? 0) >= LOGIN_MAX;
};

export const recordLoginFailure = async (ip: string): Promise<void> => {
  localRecordFailure(ip);
  if (!supabaseConfigured()) return;

  const db = supabaseAdmin();
  const cutoff = new Date(Date.now() - LOGIN_RETENTION_MS).toISOString();
  const prune = await db.from("auth_attempts").delete().lt("attempted_at", cutoff);
  if (prune.error) {
    degrade("prune", prune.error.message);
    return;
  }
  const insert = await db.from("auth_attempts").insert({ ip });
  if (insert.error) degrade("insert", insert.error.message);
};

export const clearLoginFailures = async (ip: string): Promise<void> => {
  localLoginFailures.delete(ip);
  if (!supabaseConfigured()) return;
  const { error } = await supabaseAdmin().from("auth_attempts").delete().eq("ip", ip);
  if (error) degrade("clear", error.message);
};
