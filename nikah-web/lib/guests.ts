/**
 * Guest list data access + input validation.
 *
 * Server-only: every function here reaches Supabase with the secret key.
 * Validation lives beside the queries so the dashboard API routes and any
 * future script share one definition of a legal guest record.
 */
import { supabaseAdmin } from "./supabaseAdmin";
import {
  GUEST_GROUPS,
  INVITE_TYPES,
  type GuestGroup,
  type GuestRow,
  type GuestWithRsvp,
  type InviteType,
} from "./db.types";
import { normalizePhone } from "./phone";
import { isValidSlug, slugify } from "./slug";

export { isValidSlug, slugify };
export type { GuestWithRsvp };

export type GuestInput = {
  slug: string;
  display_name: string;
  whatsapp_name: string | null;
  phone: string | null;
  guest_group: GuestGroup;
  invite_type: InviteType;
  party_label: string;
  party_max: number;
  message_override: string | null;
  notes: string | null;
};

export class GuestError extends Error {
  constructor(
    readonly code: "INVALID_INPUT" | "SLUG_TAKEN" | "NOT_FOUND" | "DB_ERROR",
    message: string,
  ) {
    super(message);
    this.name = "GuestError";
  }
}

const cleanText = (value: unknown, max: number): string =>
  typeof value === "string"
    ? value
        .replace(/[\u0000-\u001F\u007F]/g, " ")
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, max)
    : "";

/** Throws `GuestError("INVALID_INPUT")` with a message meant for the dashboard UI. */
export const validateGuestInput = (raw: unknown): GuestInput => {
  if (typeof raw !== "object" || raw === null) {
    throw new GuestError("INVALID_INPUT", "Data tidak terbaca.");
  }
  const r = raw as Record<string, unknown>;

  const display_name = cleanText(r.display_name, 120);
  if (display_name.length === 0) {
    throw new GuestError("INVALID_INPUT", "Nama tamu wajib diisi.");
  }

  const slugRaw = cleanText(r.slug, 80).toLowerCase();
  const slug = slugRaw.length > 0 ? slugRaw : slugify(display_name);
  if (!isValidSlug(slug)) {
    throw new GuestError(
      "INVALID_INPUT",
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    );
  }

  const guest_group = GUEST_GROUPS.find((g) => g === r.guest_group);
  if (!guest_group) throw new GuestError("INVALID_INPUT", "Kelompok tamu belum dipilih.");

  const invite_type = INVITE_TYPES.find((t) => t === r.invite_type);
  if (!invite_type) throw new GuestError("INVALID_INPUT", "Jenis undangan belum dipilih.");

  const phoneRaw = cleanText(r.phone, 32);
  const phone = phoneRaw.length > 0 ? normalizePhone(phoneRaw) : null;
  if (phoneRaw.length > 0 && phone === null) {
    throw new GuestError("INVALID_INPUT", "Nomor WhatsApp tidak valid.");
  }

  const partyMaxRaw = Number(r.party_max);
  const party_max =
    Number.isFinite(partyMaxRaw) && Number.isInteger(partyMaxRaw)
      ? Math.min(10, Math.max(1, partyMaxRaw))
      : 2;

  return {
    slug,
    display_name,
    whatsapp_name: cleanText(r.whatsapp_name, 120) || null,
    phone,
    guest_group,
    invite_type,
    party_label: cleanText(r.party_label, 60),
    party_max,
    message_override: cleanText(r.message_override, 1500) || null,
    notes: cleanText(r.notes, 500) || null,
  };
};

/** Postgres unique-violation on `guests.slug`. */
const isSlugConflict = (code: string | undefined): boolean => code === "23505";

export const listGuests = async (): Promise<GuestWithRsvp[]> => {
  const db = supabaseAdmin();

  const [guests, rsvps] = await Promise.all([
    db.from("guests").select("*").order("created_at", { ascending: false }),
    db
      .from("rsvps")
      .select("guest_id, kehadiran, jumlah, catatan, created_at")
      .not("guest_id", "is", null)
      .order("created_at", { ascending: false }),
  ]);

  if (guests.error) throw new GuestError("DB_ERROR", guests.error.message);
  if (rsvps.error) throw new GuestError("DB_ERROR", rsvps.error.message);

  // Rows arrive newest-first, so the first hit per guest is their latest RSVP.
  const latest = new Map<string, GuestWithRsvp["rsvp"]>();
  for (const row of rsvps.data ?? []) {
    if (row.guest_id && !latest.has(row.guest_id)) {
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
  const { error } = await supabaseAdmin().from("guests").delete().eq("id", id);
  if (error) throw new GuestError("DB_ERROR", error.message);
};

/** Fire-and-forget open counter; never blocks or fails the invitation render. */
export const trackOpen = async (slug: string): Promise<void> => {
  if (!isValidSlug(slug)) return;
  const { error } = await supabaseAdmin().rpc("track_guest_open", { guest_slug: slug });
  if (error) console.error(`track_guest_open failed for "${slug}": ${error.message}`);
};
