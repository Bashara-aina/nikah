/**
 * Hand-written Supabase schema types, mirroring
 * `supabase/migrations/0001_guests.sql`. Kept by hand rather than generated so
 * the build has no dependency on the Supabase CLI — change the migration and
 * this file together.
 */

export type GuestGroup = "groom_family" | "bride_family" | "friend";
export type InviteType = "venue" | "online";

export const GUEST_GROUPS: readonly GuestGroup[] = [
  "groom_family",
  "bride_family",
  "friend",
] as const;

export const INVITE_TYPES: readonly InviteType[] = ["venue", "online"] as const;

/** Attendance values accepted by `rsvps.kehadiran` (DB check constraint). */
export const ATTENDANCE = [
  "Hadir",
  "Tidak Hadir",
  "Masih Diusahakan",
  "Menyaksikan Daring",
] as const;
export type Attendance = (typeof ATTENDANCE)[number];

export type GuestRow = {
  id: string;
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
  alternative_channel: string | null;
  reminder_note: string | null;
  invited_at: string | null;
  opened_count: number;
  opened_confirmed_count: number;
  opened_confirmed_at: string | null;
  opened_first_at: string | null;
  opened_last_at: string | null;
  created_at: string;
  updated_at: string;
};

export type GuestInsert = Omit<
  GuestRow,
  | "id"
  | "created_at"
  | "updated_at"
  | "opened_count"
  | "opened_confirmed_count"
  | "opened_confirmed_at"
  | "opened_first_at"
  | "opened_last_at"
> &
  Partial<Pick<GuestRow, "id" | "opened_count" | "opened_confirmed_count">>;

export type GuestUpdate = Partial<GuestInsert>;

export type RsvpRow = {
  id: string;
  guest_id: string | null;
  nama: string;
  kehadiran: Attendance;
  jumlah: number;
  catatan: string;
  user_agent: string | null;
  created_at: string;
};

export type RsvpInsert = Omit<RsvpRow, "id" | "created_at"> & Partial<Pick<RsvpRow, "id">>;

export type WishRow = {
  id: string;
  guest_id: string | null;
  nama: string;
  pesan: string;
  hidden: boolean;
  created_at: string;
};

export type WishInsert = Omit<WishRow, "id" | "created_at" | "hidden"> &
  Partial<Pick<WishRow, "id" | "hidden">>;

export type AuthAttemptRow = {
  ip: string;
  attempted_at: string;
};

export type AuthAttemptInsert = Omit<AuthAttemptRow, "attempted_at"> &
  Partial<Pick<AuthAttemptRow, "attempted_at">>;

/**
 * A guest plus their latest RSVP — what the dashboard list renders. Declared
 * here so the client bundle can type it without importing the query module.
 */
export type GuestWithRsvp = GuestRow & {
  rsvp: Pick<RsvpRow, "kehadiran" | "jumlah" | "catatan" | "created_at"> | null;
};

/**
 * One RSVP reply as the dashboard reads it. `guest` is null for replies that
 * arrived without a personal link — a forwarded invitation, or a guest deleted
 * after answering (`rsvps.guest_id` is `on delete set null`). `superseded` marks
 * a reply the same guest has since replaced, kept so the couple can see that an
 * answer changed rather than wondering whether they misread it.
 */
export type DashboardRsvp = Pick<
  RsvpRow,
  "id" | "guest_id" | "nama" | "kehadiran" | "jumlah" | "catatan" | "created_at"
> & {
  guest: Pick<GuestRow, "display_name" | "slug" | "guest_group" | "invite_type"> | null;
  superseded: boolean;
};

export type Database = {
  public: {
    Tables: {
      guests: { Row: GuestRow; Insert: GuestInsert; Update: GuestUpdate; Relationships: [] };
      rsvps: { Row: RsvpRow; Insert: RsvpInsert; Update: Partial<RsvpInsert>; Relationships: [] };
      wishes: { Row: WishRow; Insert: WishInsert; Update: Partial<WishInsert>; Relationships: [] };
      auth_attempts: {
        Row: AuthAttemptRow;
        Insert: AuthAttemptInsert;
        Update: Partial<AuthAttemptInsert>;
        Relationships: [];
      };
    };
    Views: {
      latest_rsvps: { Row: RsvpRow; Relationships: [] };
    };
    Functions: {
      track_guest_open: { Args: { guest_slug: string }; Returns: undefined };
      confirm_guest_open: { Args: { guest_slug: string }; Returns: undefined };
    };
    Enums: { guest_group: GuestGroup; invite_type: InviteType };
    CompositeTypes: Record<never, never>;
  };
};
