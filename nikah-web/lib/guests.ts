/**
 * Guest list data access + input validation.
 *
 * Server-only: every function here reaches Supabase with the secret key.
 * Validation lives beside the queries so the dashboard API routes and any
 * future script share one definition of a legal guest record.
 */
import "server-only";

import { supabaseAdmin } from "./supabaseAdmin";
import type { GuestRow, GuestWithRsvp } from "./db.types";
import { GuestError, type GuestInput } from "./guestValidation";
import { isValidSlug, slugify } from "./slug";

export { GuestError, validateGuestInput } from "./guestValidation";
export { isValidSlug, slugify };
export type { GuestInput, GuestWithRsvp };

/** Postgres unique-violation on `guests.slug`. */
const isSlugConflict = (code: string | undefined): boolean => code === "23505";

export const listGuests = async (): Promise<GuestWithRsvp[]> => {
  const db = supabaseAdmin();

  const [guests, rsvps] = await Promise.all([
    db.from("guests").select("*").order("created_at", { ascending: false }),
    db.from("latest_rsvps").select("guest_id, kehadiran, jumlah, catatan, created_at"),
  ]);

  if (guests.error) throw new GuestError("DB_ERROR", guests.error.message);
  if (rsvps.error) throw new GuestError("DB_ERROR", rsvps.error.message);

  const latest = new Map<string, GuestWithRsvp["rsvp"]>();
  for (const row of rsvps.data ?? []) {
    if (row.guest_id) {
      latest.set(row.guest_id, {
        kehadiran: row.kehadiran,
        jumlah: row.jumlah,
        catatan: row.catatan,
        created_at: row.created_at,
      });
    }
  }

  return (guests.data ?? []).map((guest) => ({
    ...guest,
    rsvp: latest.get(guest.id) ?? null,
  }));
};

export const getGuestBySlug = async (slug: string): Promise<GuestRow | null> => {
  if (!isValidSlug(slug)) return null;
  const { data, error } = await supabaseAdmin()
    .from("guests")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new GuestError("DB_ERROR", error.message);
  return data ?? null;
};

export const createGuest = async (input: GuestInput): Promise<GuestRow> => {
  const { data, error } = await supabaseAdmin()
    .from("guests")
    .insert({ ...input, invited_at: null })
    .select("*")
    .single();
  if (error) {
    if (isSlugConflict(error.code)) {
      throw new GuestError("SLUG_TAKEN", `Slug "${input.slug}" sudah dipakai tamu lain.`);
    }
    throw new GuestError("DB_ERROR", error.message);
  }
  return data;
};

export const updateGuest = async (id: string, input: GuestInput): Promise<GuestRow> => {
  const { data, error } = await supabaseAdmin()
    .from("guests")
    .update(input)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) {
    if (isSlugConflict(error.code)) {
      throw new GuestError("SLUG_TAKEN", `Slug "${input.slug}" sudah dipakai tamu lain.`);
    }
    throw new GuestError("DB_ERROR", error.message);
  }
  if (!data) throw new GuestError("NOT_FOUND", "Tamu tidak ditemukan.");
  return data;
};

/** Stamps or clears the "sudah diundang" checkbox. */
export const setInvited = async (id: string, invited: boolean): Promise<GuestRow> => {
  const { data, error } = await supabaseAdmin()
    .from("guests")
    .update({ invited_at: invited ? new Date().toISOString() : null })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new GuestError("DB_ERROR", error.message);
  if (!data) throw new GuestError("NOT_FOUND", "Tamu tidak ditemukan.");
  return data;
};

export const deleteGuest = async (id: string): Promise<void> => {
  const { error, count } = await supabaseAdmin()
    .from("guests")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) throw new GuestError("DB_ERROR", error.message);
  if (count === 0) throw new GuestError("NOT_FOUND", "Tamu tidak ditemukan.");
};

export const confirmOpen = async (slug: string): Promise<void> => {
  if (!isValidSlug(slug)) throw new GuestError("INVALID_INPUT", "Slug tidak valid.");
  const { error } = await supabaseAdmin().rpc("confirm_guest_open", { guest_slug: slug });
  if (error) throw new GuestError("DB_ERROR", error.message);
};

/** Fire-and-forget open counter; never blocks or fails the invitation render. */
export const trackOpen = async (slug: string): Promise<void> => {
  if (!isValidSlug(slug)) return;
  const { error } = await supabaseAdmin().rpc("track_guest_open", { guest_slug: slug });
  if (error) console.error(`track_guest_open failed for "${slug}": ${error.message}`);
};
