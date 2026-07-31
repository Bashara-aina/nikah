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
};

export const countGuests = (guests: readonly GuestWithRsvp[]): GuestCounts => {
  const counts: GuestCounts = {
    total: guests.length,
    invited: 0,
    uninvited: 0,
    opened: 0,
    answered: 0,
    unanswered: 0,
  };

  for (const guest of guests) {
    const state = rsvpState(guest);
    if (guest.invited_at !== null) counts.invited += 1;
    else counts.uninvited += 1;
    if (guest.opened_confirmed_count > 0) counts.opened += 1;
    if (state === "answered") counts.answered += 1;
    if (state === "waiting") counts.unanswered += 1;
  }

  return counts;
};
