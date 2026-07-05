/**
 * Site config — single source of truth for dates, names, venues, RSVP deadline,
 * bank accounts, livestream, etc. All UI strings come from `docs/03-copywriting.md`;
 * values below are placeholders that match the structure of `docs/05-data-fields.md`.
 *
 * Keep this file the only place these values live. UI components import from here.
 */

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nikah.example",
  couple: {
    bride: "Hanifah Syifa Azzahra Bay",
    groom: "Bashara Aina",
    short: "Bashara & Hanifah",
    hashtag: "#BASHicallyHANIs",
  },
  event: {
    date: "2026-08-22",
    dateLabel: "22 Agustus 2026",
    timeStart: "10:00",
    timeEnd: "13:00",
    timezone: "Asia/Jakarta",
    venueName: "Venue TBD",
    venueAddress: "Address TBD",
    mapsUrl: "https://maps.app.goo.gl/TBD",
  },
  rsvp: {
    deadline: "2026-08-15",
    appsScriptUrl: process.env.APPS_SCRIPT_URL ?? "",
  },
  audio: {
    src: "/assets/audio/la-vie-en-rose.mp3",
    fadeInMs: 1200,
    fadeTarget: 0.5,
  },
  dressCode: "TBD",
  bank: {
    id: { bank: "TBD", accountNumber: "TBD", accountName: "TBD" },
    jp: { bank: "TBD", accountNumber: "TBD", accountName: "TBD" },
  },
  livestream: {
    youtube: "",
    zoom: "",
    instagram: "",
    facebook: "",
  },
} as const;

export type SiteConfig = typeof siteConfig;