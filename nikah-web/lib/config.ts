/**
 * Single source of truth for all wedding content.
 * Pulled from docs/03-copywriting.md, docs/05-data-fields.md, docs/spec/04 §5.
 * Empty strings mark values the couple must fill in before launch.
 */

const env = (k: string): string | undefined => {
  const v = process.env[k];
  return v && v.length > 0 ? v : undefined;
};

const SITE_URL = env("NEXT_PUBLIC_SITE_URL") ?? "https://nikah.example.com";
const MAPS_URL =
  env("NEXT_PUBLIC_MAPS_URL") ??
  "https://maps.app.goo.gl/eCQJZkY3qMvepZQz6";

export const config = {
  site: {
    url: SITE_URL,
    title: "Bashara & Hanifah — 22 Agustus 2026",
    description:
      "Dengan penuh syukur, kami mengundang Anda di hari bahagia kami. Akad & resepsi, 22 Agustus 2026, Widuri Restaurant, Bandung.",
    ogImage: "/og/og-cover.jpg",
  },

  couple: {
    groom: "Bashara Aina",
    bride: "Hanifah Syifa Azzahra Bay",
    hashtag: "#BASHicallyHANI's",
  },

  date: {
    iso: "2026-08-22",
    akadStart: "10:00",
    end: "13:00",
    tz: "WIB",
    /** ISO target for countdown (WIB = UTC+7). */
    countdownTargetIso: "2026-08-22T10:00:00+07:00",
  },

  /** RSVP deadline = D-7 (SPEC 04 §5). */
  rsvpDeadline: "2026-08-15",
  rsvpDeadlineDaysBefore: 7,

  venue: {
    name: "Widuri Restaurant",
    floor: "Lantai 2",
    address:
      "Jl. Ciliwung No.19, Cihapit, Bandung Wetan, Kota Bandung, Jawa Barat 40114",
    landmark: "dekat Gedung Sate",
    mapsUrl: MAPS_URL,
    phone: "+6282116606669",
    parking: "±40 mobil",
  },

  dressCode: { note: "Warna pastel" },

  etiquette: [
    "Akad dimulai pukul 10.00 — mohon hadir tepat waktu.",
    "Mohon tidak membawa anak-anak ke lantai 2.",
    "Ruang salat tersedia di lantai 1.",
    "Mohon untuk tidak menggunakan flash kamera.",
    "Mohon untuk tetap duduk selama prosesi akad berlangsung.",
  ] as const,

  livestream: {
    /** TODO: fill before launch — YouTube/Zoom/IG/FB links. */
    youtube: "",
    zoom: "",
    instagram: ["", ""] as [string, string],
    facebook: ["", "", "", ""] as [string, string, string, string],
  },

  gift: {
    banks: [
      {
        label: "Bank Indonesia",
        bank: "Bank Mandiri",
        number: "1670005812499",
        holder: "Bashara Aina",
      },
      {
        label: "Bank Jepang (JP)",
        bank: "ゆうちょ銀行 (Japan Post Bank)",
        number: "1206076",
        holder: "バ シャラ アイナ (BASHARA AINA)",
        branchCode: "138",
        branchName: "一三八",
      },
    ] as const,
    /** PREVIEW — replace with real addresses before launch. */
    address: {
      id: "Jl. Contoh Alamat No. 123, Bandung, Jawa Barat 40114",
      jp: "〒XXX-XXXX X-X-X, Shibuya-ku, Tokyo, Japan",
    },
  },

  capacity: { maxPerInvite: 4 },

  audio: {
    src: "/assets/audio/la-vie-en-rose.mp3",
    volume: 0.5,
  },

  /** Cat assets — order matters for hero stagger (dipeluk → duduk di rumput). */
  cats: [
    "cat-tuxedo-black",
    "cat-grey-white",
    "cat-tuxedo-bw",
    "cat-cream-longhair",
    "cat-tabby-grey",
    "cat-tabby-peaceful",
    "cat-tabby-sleeping",
  ] as const,
} as const;

export type Config = typeof config;

/** Warn in dev when a TODO value is empty so the user notices. */
export function warnTodo(label: string, value: unknown): void {
  if (process.env.NODE_ENV !== "production" && !value) {
    console.warn(`[config] TODO before launch — ${label}`);
  }
}