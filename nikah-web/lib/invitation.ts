/**
 * The guest shape the invitation UI receives.
 *
 * Deliberately narrower than `GuestRow`: no phone number, no notes, no
 * invite/open timestamps ever reach the browser. The server resolves the slug
 * and hands down only what the page renders.
 */
import type { GuestRow, InviteType } from "./db.types";
import { copy } from "./copy";

export type InvitationGuest = {
  /** null on the public page, which has no guest record. */
  slug: string | null;
  /** Printed verbatim on the gate, honorific included. */
  displayName: string;
  inviteType: InviteType;
  /** "Beserta Keluarga" and friends — rendered under the name when present. */
  partyLabel: string;
  partyMax: number;
};

/**
 * The bare domain and any unknown slug render this: the online invitation with
 * a generic greeting. That URL gets forwarded and pasted into bios, so it must
 * never carry the venue — anyone invited to Bandung has their own link.
 */
export const PUBLIC_GUEST: InvitationGuest = {
  slug: null,
  displayName: copy.gate.guestFallback,
  inviteType: "online",
  partyLabel: "",
  partyMax: 2,
};

export const toInvitationGuest = (row: GuestRow): InvitationGuest => ({
  slug: row.slug,
  displayName: row.display_name,
  inviteType: row.invite_type,
  partyLabel: row.party_label,
  partyMax: row.party_max,
});
