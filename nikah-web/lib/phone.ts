/**
 * Phone normalisation for WhatsApp deep links.
 *
 * Stored shape is E.164 digits with no `+` and no separators, because that is
 * exactly what `wa.me/<number>` expects.
 *
 * Rules, in order:
 *   `+81 90-1234-5678` → `819012345678`  (leading `+` is trusted as-is)
 *   `0812-3456-7890`   → `6281234567890` (Indonesian local, `0` → `62`)
 *   `62 812 3456 7890` → `6281234567890` (already has the country code)
 *   `812 3456 7890`    → `6281234567890` (Indonesian local without the `0`)
 *
 * Consequence worth knowing: a non-Indonesian number must be typed with a
 * leading `+`, otherwise the last rule prefixes `62`. The dashboard always
 * echoes the normalised number back so a wrong guess is visible before sending.
 */

const DEFAULT_COUNTRY = "62";

const digitsOnly = (value: string): string => value.replace(/\D/g, "");

/** Returns E.164 digits, or null when the input cannot be a phone number. */
export const normalizePhone = (raw: string | null | undefined): string | null => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0) return null;

  const isInternational = trimmed.startsWith("+");
  const digits = digitsOnly(trimmed);
  if (digits.length === 0) return null;

  let e164: string;
  if (isInternational) {
    e164 = digits;
  } else if (digits.startsWith("0")) {
    e164 = DEFAULT_COUNTRY + digits.replace(/^0+/, "");
  } else if (digits.startsWith(DEFAULT_COUNTRY)) {
    e164 = digits;
  } else {
    e164 = DEFAULT_COUNTRY + digits;
  }

  // E.164 allows 15 digits max; 8 is below any real mobile number.
  if (e164.length < 8 || e164.length > 15 || e164.startsWith("0")) return null;
  return e164;
};

/** `6281234567890` → `+62 812 3456 7890` for display in the dashboard. */
export const formatPhone = (e164: string | null | undefined): string => {
  if (!e164) return "";
  const groups = e164.slice(2).replace(/(\d{3,4})(?=\d)/g, "$1 ");
  return `+${e164.slice(0, 2)} ${groups}`.trim();
};

/** WhatsApp deep link: opens the app (or WhatsApp Web) with the text prefilled. */
export const whatsappLink = (e164: string | null | undefined, message: string): string | null => {
  if (!e164) return null;
  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
};
