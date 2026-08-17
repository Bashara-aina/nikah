import type { ReactNode } from "react";
import type { Attendance, GuestGroup, GuestWithRsvp, InviteType } from "@/lib/db.types";
import { templateFor } from "@/lib/waTemplates";

export const GROUP_LABEL: Record<GuestGroup, string> = {
  groom_family: "Keluarga Bashara",
  bride_family: "Keluarga Hanifah",
  friend: "Teman",
};

export const TYPE_LABEL: Record<InviteType, string> = {
  venue: "Hadir di Bandung",
  online: "Siaran langsung",
};

/** Tile-width wording. Badges keep the guest's answer verbatim. */
export const ATTENDANCE_SHORT: Record<Attendance, string> = {
  Hadir: "Hadir",
  "Tidak Hadir": "Tidak hadir",
  "Masih Diusahakan": "Diusahakan",
  "Menyaksikan Daring": "Daring",
};

/**
 * One colour per answer, so a screenful of replies reads before it is read.
 * Every badge keeps `text-ink` on a light tint rather than colouring the text —
 * `sage` and `gold` are too light to carry 4.5:1 as a foreground.
 */
const ATTENDANCE_STYLE: Record<Attendance, { dot: string; badge: string }> = {
  Hadir: { dot: "bg-sage", badge: "border-sage/70 bg-sage/25" },
  "Menyaksikan Daring": { dot: "bg-sky", badge: "border-sky/80 bg-sky/40" },
  "Masih Diusahakan": { dot: "bg-gold", badge: "border-gold/70 bg-gold/25" },
  "Tidak Hadir": { dot: "bg-dusty", badge: "border-border bg-cream" },
};

export const AttendanceDot = ({ kehadiran }: { kehadiran: Attendance }) => (
  <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${ATTENDANCE_STYLE[kehadiran].dot}`} />
);

/** The guest's answer, plus the head count when the venue asked for one. */
export const AttendanceBadge = ({
  kehadiran,
  jumlah,
}: {
  kehadiran: Attendance;
  jumlah?: number;
}) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-sans text-xs text-ink ${ATTENDANCE_STYLE[kehadiran].badge}`}
  >
    <AttendanceDot kehadiran={kehadiran} />
    {kehadiran}
    {jumlah !== undefined ? (
      <span className="tabular-nums text-ink-soft">· {jumlah} orang</span>
    ) : null}
  </span>
);

export type StatusFilter =
  | "all"
  | "belum"
  | "sudah"
  | "dibuka"
  | "rsvp"
  | "unanswered"
  | "attended"
  | "souvenir";
export type SortOrder = "newest" | "name" | "uninvited";
export type DashboardTab = "tamu" | "rsvp" | "ucapan";

/** Status wording lives on the stat tiles in `DashboardStats`, the one control
 *  that sets this filter. */
export const SORT_LABEL: Record<SortOrder, string> = {
  newest: "Terbaru",
  name: "Nama A–Z",
  uninvited: "Belum dikirim dulu",
};

export type FormState = {
  id: string | null;
  display_name: string;
  slug: string;
  whatsapp_name: string;
  phone: string;
  guest_group: GuestGroup;
  invite_type: InviteType;
  party_label: string;
  party_max: number;
  message: string;
  notes: string;
  alternative_channel: string;
  reminder_note: string;
};

export const emptyForm = (): FormState => ({
  id: null,
  display_name: "",
  slug: "",
  whatsapp_name: "",
  phone: "",
  guest_group: "friend",
  invite_type: "venue",
  party_label: "",
  party_max: 2,
  message: templateFor({ guest_group: "friend", invite_type: "venue" }),
  notes: "",
  alternative_channel: "",
  reminder_note: "",
});

export const formFromGuest = (guest: GuestWithRsvp): FormState => ({
  id: guest.id,
  display_name: guest.display_name,
  slug: guest.slug,
  whatsapp_name: guest.whatsapp_name ?? "",
  phone: guest.phone ?? "",
  guest_group: guest.guest_group,
  invite_type: guest.invite_type,
  party_label: guest.party_label,
  party_max: guest.party_max,
  message: guest.message_override || templateFor(guest),
  notes: guest.notes ?? "",
  alternative_channel: guest.alternative_channel ?? "",
  reminder_note: guest.reminder_note ?? "",
});

export const inputClass =
  "min-h-[48px] w-full rounded-2xl border border-border bg-surface px-4 font-sans text-base text-ink outline-none transition-colors focus:border-dusty/60";

export const Chip = ({
  children,
  tone = "quiet",
  title,
}: {
  children: ReactNode;
  tone?: "quiet" | "on" | "warn";
  title?: string;
}) => (
  <span
    title={title}
    className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-xs ${
      tone === "on"
        ? "bg-blush/45 text-ink"
        : tone === "warn"
          ? "border border-alert/40 bg-paper text-alert"
          : "border border-border bg-surface text-ink-soft"
    }`}
  >
    {children}
  </span>
);

/** `2026-08-12T…` → `12 Agu 2026`, short enough to sit inside a chip. */
export const formatDay = (iso: string | null): string =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "";

/** `12 Agu 2026, 19.04` — a reply's time matters, an invitation's date does not. */
export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export type { GuestCounts as DashboardStatsData } from "@/lib/rsvpSummary";
