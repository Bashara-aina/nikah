import { describe, expect, it } from "vitest";
import type { Attendance, DashboardRsvp, GuestWithRsvp } from "./db.types";
import { countGuests, rsvpState, summarizeReplies } from "./rsvpSummary";

const guest = (overrides: Partial<GuestWithRsvp> = {}): GuestWithRsvp => ({
  id: "guest-1",
  slug: "bapak-achmad",
  display_name: "Bapak Achmad",
  whatsapp_name: null,
  phone: null,
  guest_group: "friend",
  invite_type: "venue",
  party_label: "",
  party_max: 2,
  message_override: null,
  notes: null,
  alternative_channel: null,
  reminder_note: null,
  invited_at: null,
  opened_count: 0,
  opened_confirmed_count: 0,
  opened_confirmed_at: null,
  opened_first_at: null,
  opened_last_at: null,
  created_at: "2026-07-01T00:00:00.000Z",
  updated_at: "2026-07-01T00:00:00.000Z",
  rsvp: null,
  ...overrides,
});

const reply = (
  kehadiran: Attendance,
  overrides: Partial<DashboardRsvp> = {},
): DashboardRsvp => ({
  id: `rsvp-${kehadiran}-${overrides.id ?? "1"}`,
  guest_id: "guest-1",
  nama: "Bapak Achmad",
  kehadiran,
  jumlah: 1,
  catatan: "",
  created_at: "2026-07-02T00:00:00.000Z",
  guest: {
    display_name: "Bapak Achmad",
    slug: "bapak-achmad",
    guest_group: "friend",
    invite_type: "venue",
  },
  superseded: false,
  ...overrides,
});

describe("rsvpState", () => {
  it("separates a guest nobody has written to from one who owes a reply", () => {
    expect(rsvpState(guest())).toBe("not_sent");
    expect(rsvpState(guest({ invited_at: "2026-07-02T00:00:00.000Z" }))).toBe("waiting");
  });

  it("reports answered even when the invitation was never marked sent", () => {
    const answered = guest({
      rsvp: { kehadiran: "Hadir", jumlah: 2, catatan: "", created_at: "2026-07-03T00:00:00.000Z" },
    });
    expect(rsvpState(answered)).toBe("answered");
  });
});

describe("summarizeReplies", () => {
  it("counts each attendance value and sums venue heads", () => {
    const summary = summarizeReplies([
      reply("Hadir", { id: "a", jumlah: 2 }),
      reply("Hadir", { id: "b", guest_id: "guest-2", jumlah: 3 }),
      reply("Tidak Hadir", { id: "c", guest_id: "guest-3" }),
      reply("Menyaksikan Daring", { id: "d", guest_id: "guest-4" }),
    ]);

    expect(summary.replies).toBe(4);
    expect(summary.byAttendance.Hadir).toBe(2);
    expect(summary.byAttendance["Tidak Hadir"]).toBe(1);
    expect(summary.byAttendance["Menyaksikan Daring"]).toBe(1);
    expect(summary.byAttendance["Masih Diusahakan"]).toBe(0);
    expect(summary.seats).toBe(5);
  });

  it("leaves superseded replies out of every count but the revision tally", () => {
    const summary = summarizeReplies([
      reply("Hadir", { id: "new", jumlah: 2 }),
      reply("Tidak Hadir", { id: "old", superseded: true, jumlah: 4 }),
    ]);

    expect(summary.replies).toBe(1);
    expect(summary.revisions).toBe(1);
    expect(summary.byAttendance["Tidak Hadir"]).toBe(0);
    expect(summary.seats).toBe(2);
  });

  it("flags replies that arrived without a guest link", () => {
    const summary = summarizeReplies([
      reply("Hadir", { id: "linked" }),
      reply("Hadir", { id: "loose", guest_id: null, guest: null }),
    ]);

    expect(summary.unlinked).toBe(1);
    expect(summary.replies).toBe(2);
  });

  it("returns zeroes for an empty list", () => {
    const summary = summarizeReplies([]);
    expect(summary).toEqual({
      replies: 0,
      byAttendance: { Hadir: 0, "Tidak Hadir": 0, "Masih Diusahakan": 0, "Menyaksikan Daring": 0 },
      seats: 0,
      unlinked: 0,
      revisions: 0,
    });
  });
});

describe("countGuests", () => {
  it("splits the list into delivery and reply stages", () => {
    const counts = countGuests([
      guest({ id: "a" }),
      guest({ id: "b", invited_at: "2026-07-02T00:00:00.000Z" }),
      guest({
        id: "c",
        invited_at: "2026-07-02T00:00:00.000Z",
        opened_confirmed_count: 2,
        rsvp: {
          kehadiran: "Hadir",
          jumlah: 1,
          catatan: "",
          created_at: "2026-07-03T00:00:00.000Z",
        },
      }),
    ]);

    expect(counts).toEqual({
      total: 3,
      invited: 2,
      uninvited: 1,
      opened: 1,
      answered: 1,
      unanswered: 1,
    });
  });
});
