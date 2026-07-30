import type { ReactNode } from "react";
import type { GuestGroup, GuestWithRsvp, InviteType } from "@/lib/db.types";
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

export type StatusFilter = "all" | "belum" | "sudah" | "dibuka" | "rsvp" | "unanswered";
export type SortOrder = "newest" | "name" | "uninvited";
export type DashboardTab = "tamu" | "ucapan";

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

export type DashboardStatsData = {
  total: number;
  invited: number;
  uninvited: number;
  opened: number;
  answered: number;
  unanswered: number;
};
