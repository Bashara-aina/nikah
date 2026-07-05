/**
 * Guest name decoding from `?to=<urlencoded name>` query parameter.
 * Used by the Gate component to personalise the opening page.
 */

const DEFAULT_GUEST_NAME = "Bapak/Ibu/Saudara/i";

export const decodeGuestName = (raw: string | null | undefined): string => {
  if (!raw) return DEFAULT_GUEST_NAME;
  try {
    const decoded = decodeURIComponent(raw).trim();
    return decoded.length === 0 ? DEFAULT_GUEST_NAME : decoded;
  } catch {
    return DEFAULT_GUEST_NAME;
  }
};

export const guestNameFromSearchParams = (
  params: Readonly<Record<string, string | string[] | undefined>>,
): string => {
  const raw = params.to;
  if (Array.isArray(raw)) return decodeGuestName(raw[0] ?? null);
  return decodeGuestName(raw ?? null);
};