# STAGE 4 — Narrative Sections (emosi & cerita)

## Goal
Bangun section naratif/presentational: **Welcome, Countdown, Story, Japan, Closing**. Fokus konten + gerak reveal/idle (belum ada backend). Tiap section penuhi "section contract".

## Prereq
Stage 3 (hero & motion proven).

## Tasks (ikuti `docs/10` + wireframe `docs/spec/12 §2`)
1. **Welcome** (`docs/10 §4`): `illustrations/welcome-accent.png` (doves+bunga, float), sambutan hangat + **Surat Yasin Ayat 36**. Teks reveal per-baris (stagger), accent breathing. Konten dari `docs/03-copywriting.md` via `lib/copy.ts`.
2. **Countdown** (`docs/10 §5`): `scenes/countdown-bg.webp` (opaque band) + angka **Hari·Jam·Menit·Detik** ke target `config.date` (22 Agt 2026, 10:00 WIB). Angka **roll mikro** tiap detik (bukan snap). `Countdown unit` UI (`docs/spec/09 §5`). Hitung akurat (timezone WIB).
3. **Story** (`docs/10 §6`): baris-baris pendek kronologis (ketemu online → tumbuh → menuju Jepang), orang ketiga, subtle. Ilustrasi `illustrations/story-meeting.png` & `story-growing.png` selang-seling kiri/kanan, slide+settle; idle breathing.
4. **Japan** (`docs/10 §7`): `illustrations/japan-motif.png` (Keio Hiyoshi & SIT Tokyo) + **petals varian sakura** (Particles palet pink) aktif di section ini. Reveal + idle.
5. **Closing** (`docs/10 §12`): mini-assemble dunia hero (`couple-cutout` + beberapa `cat-*` + `cat-peek`), pesan "Tak sabar menanti kehadiranmu di hari bahagia kami." `cat-peek` mengintip; doves terbang ke atas; audio tetap loop.
6. **Divider** (`components/ui/Divider.tsx`): `florals/drapery-divider.png` sebagai transisi antar-section (`docs/10 §0`).
7. Semua: pakai primitives Stage 2 (`Reveal/Breathing/Sway/Stagger`), seed acak; lazy-mount bila berat (`docs/spec/11 §5`).

## Files created
`components/sections/{Welcome,Countdown,Story,Japan,Closing}.tsx` · `components/ui/Divider.tsx` · `lib/copy.ts` (teks dari `docs/03`) · util `lib/date.ts` (countdown, formatTanggalID)

## Assets used
`illustrations/{welcome-accent,story-meeting,story-growing,japan-motif}.png` · `scenes/countdown-bg.webp` · `couple/couple-cutout.png` · `cats/cat-peek.png` (+ beberapa `cat-*` di closing) · `florals/{drapery-divider,accent-doves}.png`

## Cross-refs
`docs/10 §4–7,12` · `docs/03-copywriting.md` (teks final) · `docs/spec/04 §5` (config tanggal) · `docs/spec/09 §5` (countdown unit) · `docs/spec/12 §2,4` (layout/hierarki) · `docs/12` (asset motion map).

## Exit criteria
- [ ] 5 section render sesuai wireframe; konten dari config/copy (tak hardcode)
- [ ] Countdown akurat ke 22 Agt 2026 10:00 WIB; angka roll halus
- [ ] Story baris pendek kronologis; ilustrasi reveal selang-seling
- [ ] Japan: sakura ambient aktif hanya di section ini
- [ ] Closing: cat-peek + doves keluar; emosi simetris dengan hero
- [ ] Tiap section: reveal + ≥1 idle + exit halus; reduced-motion → fade
- [ ] 60fps; tak ada CLS

→ Lanjut **STAGE 5 — Functional Sections & Backend**.
