/**
 * RSVP read access for the dashboard.
 *
 * Server-only: reaches Supabase with the secret key. The guest join is done in
 * JS rather than as a PostgREST embed because `db.types.ts` is hand-written and
 * declares no relationships — same shape as `listGuests`.
 */
import "server-only";

import type { DashboardRsvp } from "./db.types";
import { supabaseAdmin } from "./supabaseAdmin";

export class RsvpError extends Error {
  constructor(
    readonly code: "DB_ERROR",
    message: string,
  ) {
    super(message);
    this.name = "RsvpError";
  }
}

/**
 * Every reply, newest first, each carrying the guest it belongs to. Earlier
 * replies from the same guest are flagged `superseded` here rather than dropped:
 * `latest_rsvps` already gives the dashboard list the current answer, and the
 * couple still needs to see that "Hadir" used to say "Tidak Hadir".
 */
export const listRsvpsForDashboard = async (): Promise<DashboardRsvp[]> => {
  const db = supabaseAdmin();

  const [rsvps, guests] = await Promise.all([
    db
      .from("rsvps")
      .select("id, guest_id, nama, kehadiran, jumlah, catatan, created_at")
      .order("created_at", { ascending: false })
      .limit(1000),
    db.from("guests").select("id, display_name, slug, guest_group, invite_type"),
  ]);

  if (rsvps.error) throw new RsvpError("DB_ERROR", rsvps.error.message);
  if (guests.error) throw new RsvpError("DB_ERROR", guests.error.message);

  const byId = new Map(
    (guests.data ?? []).map((guest) => [
      guest.id,
      {
        display_name: guest.display_name,
        slug: guest.slug,
        guest_group: guest.guest_group,
        invite_type: guest.invite_type,
      },
    ]),
  );

  const seen = new Set<string>();
  return (rsvps.data ?? []).map((row) => {
    const superseded = row.guest_id !== null && seen.has(row.guest_id);
    if (row.guest_id !== null) seen.add(row.guest_id);
    return {
      id: row.id,
      guest_id: row.guest_id,
      nama: row.nama,
      kehadiran: row.kehadiran,
      jumlah: row.jumlah,
      catatan: row.catatan,
      created_at: row.created_at,
      guest: row.guest_id ? (byId.get(row.guest_id) ?? null) : null,
      superseded,
    };
  });
};
