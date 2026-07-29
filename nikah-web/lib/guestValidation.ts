import {
  GUEST_GROUPS,
  INVITE_TYPES,
  type GuestGroup,
  type InviteType,
} from "./db.types";
import { normalizePhone } from "./phone";
import { isValidSlug, slugify } from "./slug";

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
  alternative_channel: string | null;
  reminder_note: string | null;
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

export const validateGuestInput = (raw: unknown): GuestInput => {
  if (typeof raw !== "object" || raw === null) {
    throw new GuestError("INVALID_INPUT", "Data tidak terbaca.");
  }
  const record = raw as Record<string, unknown>;

  const displayName = cleanText(record.display_name, 120);
  if (displayName.length === 0) {
    throw new GuestError("INVALID_INPUT", "Nama tamu wajib diisi.");
  }

  const rawSlug = cleanText(record.slug, 80).toLowerCase();
  const slug = rawSlug.length > 0 ? rawSlug : slugify(displayName);
  if (!isValidSlug(slug)) {
    throw new GuestError(
      "INVALID_INPUT",
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung.",
    );
  }

  const guestGroup = GUEST_GROUPS.find((group) => group === record.guest_group);
  if (!guestGroup) throw new GuestError("INVALID_INPUT", "Kelompok tamu belum dipilih.");

  const inviteType = INVITE_TYPES.find((type) => type === record.invite_type);
  if (!inviteType) throw new GuestError("INVALID_INPUT", "Jenis undangan belum dipilih.");

  const rawPhone = cleanText(record.phone, 32);
  const phone = rawPhone.length > 0 ? normalizePhone(rawPhone) : null;
  if (rawPhone.length > 0 && phone === null) {
    throw new GuestError("INVALID_INPUT", "Nomor WhatsApp tidak valid.");
  }

  const rawPartyMax = Number(record.party_max);
  const partyMax =
    Number.isFinite(rawPartyMax) && Number.isInteger(rawPartyMax)
      ? Math.min(10, Math.max(1, rawPartyMax))
      : 2;

  return {
    slug,
    display_name: displayName,
    whatsapp_name: cleanText(record.whatsapp_name, 120) || null,
    phone,
    guest_group: guestGroup,
    invite_type: inviteType,
    party_label: cleanText(record.party_label, 60),
    party_max: partyMax,
    message_override: cleanText(record.message_override, 1500) || null,
    notes: cleanText(record.notes, 500) || null,
    alternative_channel: cleanText(record.alternative_channel, 120) || null,
    reminder_note: cleanText(record.reminder_note, 300) || null,
  };
};
