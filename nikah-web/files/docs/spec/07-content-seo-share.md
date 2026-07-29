# SPEC 07 — Content, i18n, SEO & Sharing

Konten, metadata, share, dan suara. Bahasa: **Bahasa Indonesia** (mengikuti `docs/03-copywriting.md`). Konten dari `lib/config.ts` + copywriting.

---

## 1. Content management
- **Sumber teks tunggal**: copy naratif final dari `docs/03-copywriting.md`, data acara dari `lib/config.ts` (SPEC 04 §5). Komponen **tidak** hardcode teks — impor dari config/konstanta agar mudah diedit.
- Struktur konstanta `lib/copy.ts` (opsional) untuk teks panjang per section (welcome, story lines, gift wording, FAQ).
- Bahasa & nada: hangat, puitis, sederhana, orang ketiga (`docs/01`,`03`). Tidak memaksa di bagian gift.

---

## 2. i18n
- **Single language: Bahasa Indonesia.** Tidak ada toggle (sesuai keputusan). `<html lang="id">`.
- Format tanggal Indonesia: "22 Agustus 2026", jam "10.00 WIB". Util `formatTanggalID()`.
- Hindari istilah teknis di UI; ramah keluarga.

---

## 3. SEO & metadata (Next `metadata`)
```ts
export const metadata = {
  title: "Bashara & Hanifah — 22 Agustus 2026",
  description: "Dengan penuh syukur, kami mengundang Anda di hari bahagia kami. Akad & resepsi, 22 Agustus 2026, Widuri Restaurant, Bandung.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  openGraph: {
    title:"Bashara & Hanifah", description:"22 Agustus 2026 · Bandung",
    images:[{ url:"/og/og-cover.jpg", width:1200, height:630 }], type:"website", locale:"id_ID"
  },
  twitter:{ card:"summary_large_image" },
  robots:{ index:true, follow:true },
  icons:{ icon:"/favicon.png", apple:"/apple-touch-icon.png" }
}
```
- **OG image**: buat `public/og/og-cover.jpg` (1200×630) dari `scenes/hero-card.webp` + teks nama & tanggal (dibuat sekali, statis). Jangan pakai nama tamu di OG (link disebar di grup; OG harus generik & ter-cache).
- Title/description generik (tanpa `?to=`).

---

## 4. Social sharing (WhatsApp-first)
- Target utama share = **WhatsApp grup keluarga** (`docs/01`). Pastikan OG render bagus di WA (1200×630, < 300KB, teks terbaca kecil).
- Tombol/share opsional: "Bagikan" pakai Web Share API (`navigator.share`) di mobile.
- Personalisasi tetap via `?to=` (bukan via OG).

---

## 5. Favicon / icons / manifest
- `favicon.png` + `apple-touch-icon.png` (180×180): motif kucing/hati pastel atau monogram "B&H".
- `site.webmanifest` ringan (name, theme-color ivory `#FBF7F0`, icons). Bukan PWA penuh; cukup "add to home screen" rapi.
- `theme-color` meta = ivory.

---

## 6. Structured data (opsional, ringan)
- JSON-LD `Event` (name, startDate 2026-08-22T10:00+07:00, endDate 13:00, location Widuri Restaurant + address). Membantu rich preview. Opsional, tidak wajib.

---

## 7. Crawl & files
- `app/robots.ts` → allow all. `app/sitemap.ts` → satu URL `/`.
- Tidak ada halaman tamu unik untuk diindeks (semua `?to=` = halaman sama).

---

## 8. Fonts (perf)
- `next/font` self-host: 1 serif display + 1 sans body, subset `latin`, `display:swap`, preload heading. Hindari FOIT/CLS.
- Batasi weight (mis. serif 500/600, sans 400/500) agar ringan.

---

## 9. Copy mapping per section (ringkas; detail di `docs/03`)
| Section | Konten kunci |
| :-- | :-- |
| Gate | "Kepada, {Nama}" lembut + "Buka Undangan" |
| Hero | "We are getting married" · Bashara & Hanifah · 22 Agustus 2026 |
| Welcome | sambutan hangat + **Surat Yasin Ayat 36** |
| Countdown | label hari·jam·menit·detik |
| Story | baris pendek kronologis (ketemu online → tumbuh → Jepang) |
| Japan | mimpi studi: Keio (Hiyoshi) & SIT Tokyo |
| Event | tanggal/jam, venue, alamat, map, dress code pastel, etiquette, livestream |
| RSVP | label field + deadline D-7 |
| Wishes | ajakan kirim ucapan |
| Gift | "Tanda Kasih" — nada apresiatif; bank ID & JP setara + alamat hadiah |
| Closing | "Tak sabar menanti kehadiranmu di hari bahagia kami." |

---

## 10. Content/SEO checklist
- [ ] semua teks dari config/copy (tidak hardcode)
- [ ] metadata + OG image generik (1200×630)
- [ ] favicon/apple-icon/manifest/theme-color
- [ ] lang=id, format tanggal ID
- [ ] robots/sitemap
- [ ] fonts self-host, no CLS
- [ ] (opsional) JSON-LD Event, Web Share

Lanjut: **SPEC 08 — Build, Test & Deploy**.
