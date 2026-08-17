/**
 * Pure RSVP aggregation, shared by the dashboard client components.
 *
 * Kept out of `rsvps.ts` so the browser bundle can count answers without
 * pulling in the server-only Supabase client.
 */
import { ATTENDANCE, type Attendance, type DashboardRsvp, type GuestWithRsvp } from "./db.types";

/**
 * Where one guest stands. "Belum dijawab" splits in two on purpose: an
 * invitation nobody has sent yet is the couple's job, one already sent is the
 * guest's — and only the second is worth chasing.
 */
export type RsvpState = "answered" | "waiting" | "not_sent";

export const rsvpState = (guest: GuestWithRsvp): RsvpState => {
  if (guest.rsvp !== null) return "answered";
  return guest.invited_at !== null ? "waiting" : "not_sent";
};

export type RsvpSummary = {
  /** Current replies: the latest from each guest, plus every unlinked reply. */
  replies: number;
  byAttendance: Record<Attendance, number>;
  /** Heads expected at the venue — the sum of `jumlah` across "Hadir" replies. */
  seats: number;
  /** Replies with no guest row behind them (forwarded link, or guest deleted). */
  unlinked: number;
  /** Earlier answers the same guest has since replaced. */
  revisions: number;
};

const emptyByAttendance = (): Record<Attendance, number> =>
  ATTENDANCE.reduce(
    (acc, value) => {
      acc[value] = 0;
      return acc;
    },
    {} as Record<Attendance, number>,
  );

export const summarizeReplies = (replies: readonly DashboardRsvp[]): RsvpSummary => {
  const summary: RsvpSummary = {
    replies: 0,
    byAttendance: emptyByAttendance(),
    seats: 0,
    unlinked: 0,
    revisions: 0,
  };

  for (const reply of replies) {
    if (reply.superseded) {
      summary.revisions += 1;
      continue;
    }
    summary.replies += 1;
    summary.byAttendance[reply.kehadiran] += 1;
    if (reply.guest === null) summary.unlinked += 1;
    if (reply.kehadiran === "Hadir") summary.seats += reply.jumlah;
  }

  return summary;
};

export type GuestCounts = {
  total: number;
  invited: number;
  uninvited: number;
  opened: number;
  answered: number;
  unanswered: number;
  /** Invitations marked arrived at the venue (day-of checklist). */
  attended: number;
  /** Invitations that have already collected a souvenir. */
  souvenir: number;
  /** Heads covered by invitations already marked sent (venue = party_max, online = 1). */
  paxInvited: number;
  /** Heads reported on filled RSVPs — sum of `jumlah` across answered guests. */
  paxRsvp: number;
  /** Heads behind invitations marked arrived — RSVP `jumlah`, else invitation size. */
  paxAttended: number;
  /** Heads behind invitations that collected a souvenir. */
  paxSouvenir: number;
};

/** Online invites are one seat; venue invites reserve `party_max` seats. */
const invitationPax = (guest: GuestWithRsvp): number =>
  guest.invite_type === "online" ? 1 : guest.party_max;

/**
 * Day-of head count for one invitation. Prefer the number they wrote on the
 * form; fall back to the reserved party size when they have not answered yet.
 */
const reportedPax = (guest: GuestWithRsvp): number =>
  guest.rsvp?.jumlah ?? invitationPax(guest);

export const countGuests = (guests: readonly GuestWithRsvp[]): GuestCounts => {
  const counts: GuestCounts = {
    total: guests.length,
    invited: 0,
    uninvited: 0,
    opened: 0,
    answered: 0,
    unanswered: 0,
    attended: 0,
    souvenir: 0,
    paxInvited: 0,
    paxRsvp: 0,
    paxAttended: 0,
    paxSouvenir: 0,
  };

  for (const guest of guests) {
    const state = rsvpState(guest);
    if (guest.invited_at !== null) {
      counts.invited += 1;
      counts.paxInvited += invitationPax(guest);
    } else {
      counts.uninvited += 1;
    }
    if (guest.opened_confirmed_count > 0) counts.opened += 1;
    if (state === "answered") {
      counts.answered += 1;
      counts.paxRsvp += guest.rsvp?.jumlah ?? 0;
    }
    if (state === "waiting") counts.unanswered += 1;
    if (guest.attended_at !== null) {
      counts.attended += 1;
      counts.paxAttended += reportedPax(guest);
    }
    if (guest.souvenir_at !== null) {
      counts.souvenir += 1;
      counts.paxSouvenir += reportedPax(guest);
    }
  }

  return counts;
};
