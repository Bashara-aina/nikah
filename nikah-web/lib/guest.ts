/** Guest personalization via ?to= (SPEC 04 §4). */

const GENERIC_GREETING = "Bapak/Ibu/Saudara/i";

/** Reads and decodes the guest query param. Returns raw string or "" if absent. */
export function readGuest(search: URLSearchParams | string): string {
  const params =
    typeof search === "string" ? new URLSearchParams(search) : search;
  const raw = params.get("to");
  if (!raw) return "";
  try {
    return decodeURIComponent(raw).trim();
  } catch {
    return raw.trim();
  }
}

/** Build greeting shown on the gate. Falls back to generic. */
export function greeting(name: string): string {
  const trimmed = name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : GENERIC_GREETING;
}

/** Build the shareable URL for a given name (Stage 7 generator). */
export function buildGuestLink(siteUrl: string, name: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/?to=${encodeURIComponent(name)}`;
}