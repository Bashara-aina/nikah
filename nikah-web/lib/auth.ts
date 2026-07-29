/**
 * Dashboard session — one shared passphrase, no accounts.
 *
 * The passphrase lives in `DASHBOARD_PASSPHRASE` and is never sent to the
 * browser. A successful login sets an HMAC-signed, httpOnly cookie carrying
 * only an expiry, so the cookie cannot be forged without the passphrase and
 * carries nothing worth stealing.
 *
 * Node crypto is used deliberately: auth is checked inside server components
 * and route handlers (Node runtime), not in Edge middleware.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "nikah_dashboard";
const SESSION_DAYS = 30;

const secret = (): string => process.env.DASHBOARD_PASSPHRASE ?? "";

export const dashboardConfigured = (): boolean => secret().length > 0;

const sign = (payload: string): string =>
  createHmac("sha256", secret()).update(payload).digest("base64url");

/** Compares without leaking length or position through timing. */
const safeEqual = (a: string, b: string): boolean => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
};

export const passphraseMatches = (candidate: string): boolean => {
  const expected = secret();
  if (expected.length === 0) return false;
  return safeEqual(candidate, expected);
};

/** `<expiryMs>.<signature>` */
export const issueSession = (): { value: string; maxAge: number } => {
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const expiry = String(Date.now() + maxAge * 1000);
  return { value: `${expiry}.${sign(expiry)}`, maxAge };
};

export const verifySession = (token: string | undefined): boolean => {
  if (!token || secret().length === 0) return false;
  const [expiry, signature] = token.split(".");
  if (!expiry || !signature) return false;
  if (!safeEqual(signature, sign(expiry))) return false;
  const expiresAt = Number(expiry);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
};

/** Reads the request cookie — for server components and route handlers. */
export const hasDashboardSession = async (): Promise<boolean> => {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
};
