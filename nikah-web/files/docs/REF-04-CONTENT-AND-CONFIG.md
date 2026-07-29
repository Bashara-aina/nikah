# REF 04 — CONTENT & CONFIG (single source of truth)

> Removes every `"TBD"`. Gives Cursor the real `lib/config.ts` values from `docs/05`, a typed `lib/copy.ts` from the locked `docs/03`, the guest-link generator, and the exact short list of values to ask the user for. Copy is **locked** — transcribe it, don't rewrite it.

---

## 1. `lib/config.ts` — fill the real values
The scaffold has the right shape with placeholders. Replace the `event`, `rsvp`, `bank`, `livestream`, `dressCode` placeholders with the confirmed data from `docs/05 §6` and `docs/03 §6`:

```ts
event: {
  date: "2026-08-22",
  dateLabel: "22 Agustus 2026",
  dayLabel: "Sabtu",
  timeStart: "10:00",
  timeEnd: "13:00",
  timezone: "Asia/Jakarta",
  countdownTarget: "2026-08-22T10:00:00+07:00",
  venueName: "Widuri Restaurant — Lantai 2",
  venueAddress: "Jl. Ciliwung No.19, Cihapit, Kec. Bandung Wetan, Kota Bandung, Jawa Barat 40114",
  venueNote: "Dekat Gedung Sate · parkir ± 40 mobil",
  venuePhone: "+6282116606669",
  mapsUrl: "https://maps.app.goo.gl/eCQJZkY3qMvepZQz6",
},
rsvp: {
  deadline: "2026-08-15",          // D-7
  deadlineLabel: "15 Agustus 2026",
  maxPax: 4,
  appsScriptUrl: process.env.APPS_SCRIPT_URL ?? "",
},
dressCode: "Warna pastel",
calendar: {
  title: "Pernikahan Bashara & Hanifah",
  start: "2026-08-22T10:00:00+07:00",
  end:   "2026-08-22T13:00:00+07:00",
  location: "Widuri Restaurant, Bandung",
},
```
Keep `couple` (`Bashara Aina`, `Hanifah Syifa Azzahra Bay`, `Bashara & Hanifah`, `#BASHicallyHANI's`) and `audio` as-is. Etiquette notes + livestream + bank go in `copy.ts`/`config` per below.

## 2. Etiquette + livestream (from `docs/03 §6`)
```ts
etiquette: [
  "Akad dimulai pukul 10.00 — mohon hadir tepat waktu.",
  "Mohon tidak membawa anak-anak ke lantai 2.",
  "Ruang salat tersedia di lantai 1.",
  "Mohon untuk tidak menggunakan flash kamera.",
  "Mohon untuk tetap duduk selama prosesi akad berlangsung.",
],
livestream: { youtube: "", zoom: "", instagram: "", facebook: "" },  // URLs from user
```

## 3. `lib/copy.ts` — transcribe ALL copy from `docs/03` (typed)
Create this so no component hardcodes Indonesian text. Shape (fill bodies verbatim from `docs/03`):
```ts
export const copy = {
  loading: { hashtag: "#BASHicallyHANI's" },
  gate: {
    eyebrow: "The Wedding of",
    greeting: "Kepada yang terkasih,",
    invite: "Dengan penuh syukur, kami mengundangmu untuk menjadi bagian dari hari bahagia kami.",
    cta: "Buka Undangan",
  },
  hero: { eyebrow: "We are getting married", date: "22 · 08 · 2026" },
  welcome: {
    body: ["Bismillahirrahmanirrahim.", "Dengan memohon rahmat dan ridha Allah SWT, …"],   // docs/03 §3
    verse: "Maha Suci (Allah) yang telah menciptakan semuanya berpasang-pasangan, …",
    verseRef: "QS. Yasin: 36",
  },
  countdown: { label: "Menghitung hari menuju", units: { days:"Hari", hours:"Jam", minutes:"Menit", seconds:"Detik" } },
  story: { title: "Kisah Kami", chapters: [ /* 6 — heading + lines + illustration, docs/03 §5 */ ] },
  event: { /* akad+resepsi, venue, dress, etiquette, livestream labels — docs/03 §6 */ },
  rsvp: { title:"Konfirmasi Kehadiran", lead:"Doa dan kehadiranmu adalah hadiah terindah bagi kami.",
          options:["Hadir","Tidak Hadir","Masih Diusahakan"], submit:"Kirim Konfirmasi",
          success:"Terima kasih! Sampai jumpa di hari bahagia kami 💕" },
  wishes: { title:"Ucapan & Doa", lead:"Tinggalkan secarik doa dan harapan untuk kami …", submit:"Kirim Ucapan" },
  gift: { title:"Tanda Kasih", lead:"Kehadiran dan doamu sudah lebih dari cukup membahagiakan kami. …" },
  faq: [ /* 5 Q/A from docs/03 §9 */ ],
  closing: { lead:"Dengan penuh kebahagiaan, kami menanti kehadiranmu.",
             line:"Tak sabar bertemu denganmu di hari bahagia kami. 🤍",
             signature:"Bashara & Hanifah", hashtag:"#BASHicallyHANI's" },
} as const;
```
The 6 story chapters map to illustrations (REF: GUIDE 03 §3): `story-meeting`, `story-motor`, `story-jakarta`, `story-ldr`, `story-keio`, `story-married`. Use the chapter headings + lines exactly from `docs/03 §5`.

Guest name interpolation: components import `decodeGuestName`/`guestNameFromSearchParams` from `lib/guest.ts` (already built) and inject into the gate greeting + RSVP prefill. Fallback `"Bapak/Ibu/Saudara/i"`.

## 4. Guest-link generator (`scripts/generate-guest-links.mjs`)
A tiny CSV→URL helper for broadcasting (`docs/05 §1`):
```js
// node scripts/generate-guest-links.mjs guests.csv > links.csv
// guests.csv:  nama
import { readFileSync } from "node:fs";
const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nikah.example";
const lines = readFileSync(process.argv[2], "utf8").trim().split("\n").slice(1);
console.log("nama,link");
for (const nama of lines) {
  const n = nama.trim(); if (!n) continue;
  console.log(`${n},${base}/?to=${encodeURIComponent(n)}`);
}
```
(Pattern `?to=Nama+Tamu`; a `?g=slug` variant is optional if names need to stay private in the URL.)

## 5. ⬇️ VALUES TO GET FROM THE USER (ask once, in a single message)
Everything else is known. Ask the user for exactly these, then fill `config`/`copy`:
1. **Bank Indonesia:** bank name · no. rekening · atas nama.
2. **Bank Japan:** bank · account · name.
3. **Gift address** (alamat kirim hadiah fisik).
4. **Livestream URLs:** YouTube (main) · Zoom · Instagram (mempelai) · Facebook (orang tua).
5. **Final domain** for `NEXT_PUBLIC_SITE_URL` + OG image (or confirm the Vercel default for now).
6. **`la-vie-en-rose.mp3`** — confirm it's in `assets/audio/` and compressed (~1.5 MB, ≤128 kbps mono); if not, the user provides/compresses it (ffmpeg, GUIDE 01 §6 has the command).
7. **`APPS_SCRIPT_URL`** after they deploy the Apps Script (REF 03 §3).

Until provided, render gift/livestream with a graceful "menyusul / coming soon" state (commented, not lorem) — never broken UI. Do not invent bank numbers.

**Acceptance:** no `"TBD"` remains in shipped config; every component reads text from `copy.ts` and data from `siteConfig`; the guest link generator produces working `?to=` URLs; the one "values needed" question has been asked.
