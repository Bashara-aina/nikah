/**
 * In-memory token-bucket rate limiter (SPEC 03 §3, SPEC 05).
 * Per-IP, per-action. Reasonable for an invitation site; not a hardened
 * distributed limiter. Edge-safe.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const BUCKETS = new Map<string, Bucket>();

export interface RateLimitOpts {
  /** Max requests allowed in the window. */
  max: number;
  /** Window size in ms. */
  windowMs: number;
}

export function rateLimit(
  ip: string,
  action: string,
  opts: RateLimitOpts,
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const key = `${action}::${ip}`;
  const existing = BUCKETS.get(key);

  if (!existing || existing.resetAt < now) {
    BUCKETS.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, remaining: opts.max - 1, resetMs: opts.windowMs };
  }

  if (existing.count >= opts.max) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: existing.resetAt - now,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: opts.max - existing.count,
    resetMs: existing.resetAt - now,
  };
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "anon";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "anon";
}
