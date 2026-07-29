/**
 * Site config — single source of truth for dates, names, venue, RSVP deadline,
 * bank accounts, livestream, etc. All UI strings come from `lib/copy.ts`
 * (locked in `relevant/10-docs/03-copywriting.md`); values below follow
 * `docs/05-data-fields.md` structure.
 *
 * Bank / livestream / gift-address values are intentionally empty until the
 * couple provides them (REF-04 §5) — the UI renders honest "menyusul" states.
 */

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nikah.example",
  couple: {
    bride: "Hanifah Syifa Azzahra Bay",
    groom: "Bashara Aina",
    /** Display order is bride-first (H & B). */
    short: "Hanifah & Bashara",
    hashtag: "#BASHicallyHANI's",
    parents: {
      bride: "Anak dari Achmad Fuad Bay dan Eulis Galih",
      groom: "Anak dari Adlinsyah dan Hartanti Rahayuningsih",
    },
  },
  event: {
    date: "2026-08-22",
    dateLabel: "22 Agustus 2026",
    /** Akad start, local WIB. */
    startIso: "2026-08-22T10:00:00+07:00",
    endIso: "2026-08-22T13:00:00+07:00",
    timeStart: "10.00",
    timeEnd: "13.00",
    timezone: "Asia/Jakarta",
    venueName: "Widuri Restaurant",
    venueFloor: "Lantai 2",
    venueAddress:
      "Jl. Ciliwung No.19, Cihapit, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40114",
    /** Derived from the locked address — search link, not an invented place ID. */
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Widuri Restaurant, Jl. Ciliwung No.19, Cihapit, Bandung Wetan, Kota Bandung",
      ),
  },
  rsvp: {
    /** D-7 before the wedding per locked copy. */
    deadline: "2026-08-15",
    deadlineLabel: "15 Agustus 2026",
    maxParty: 4,
  },
  audio: {
    src: "/assets/audio/la-vie-en-rose.mp3",
    fadeInMs: 1200,
    fadeTarget: 0.3,
  },
  bank: {
    /** Values pending from the couple — empty string = render "menyusul". */
    id: { bank: "", accountNumber: "", accountName: "" },
    jp: { bank: "", accountNumber: "", accountName: "" },
    giftAddress: "",
  },
  livestream: {
    youtube: "",
    zoom: "",
    instagram: "",
    facebook: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Google Calendar template URL derived from locked event facts.
 *
 * `online: true` is used by the livestream invitation, where putting the Widuri
 * address in the guest's calendar would be wrong — it points at the stream
 * instead, or says so plainly while the links are still pending.
 */
export const calendarUrl = (opts: { online?: boolean } = {}): string => {
  const fmt = (iso: string) =>
    new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${siteConfig.couple.short}`,
    dates: `${fmt(siteConfig.event.startIso)}/${fmt(siteConfig.event.endIso)}`,
    details: siteConfig.couple.hashtag,
    location: opts.online
      ? siteConfig.livestream.youtube || "Siaran langsung (tautan menyusul)"
      : `${siteConfig.event.venueName} ${siteConfig.event.venueFloor}, ${siteConfig.event.venueAddress}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
