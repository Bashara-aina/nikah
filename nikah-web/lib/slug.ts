/**
 * Slug rules, shared by the dashboard UI and the server.
 *
 * Kept apart from `lib/guests.ts` because the browser needs these two
 * functions and must never pull in the Supabase client behind them.
 */

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Suggestion only — the couple types the final slug themselves, so this exists
 * to fill the field, not to own it.
 */
export const slugify = (name: string): string =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");

export const isValidSlug = (slug: string): boolean =>
  slug.length > 0 && slug.length <= 80 && SLUG_PATTERN.test(slug);
