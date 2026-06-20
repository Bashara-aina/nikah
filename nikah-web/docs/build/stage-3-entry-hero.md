# STAGE 3 — Entry Experience: Loading · Gate · Hero (signature)

## Goal
Bangun momen masuk: loading 1–2s → opening gate (nama tamu, izin gyro, audio) → **hero berlapis animated-assemble + living parallax**. Ini bukti gerak utama — uji di HP nyata.

## Prereq
Stage 2 (motion engine, primitives, particles).

## Tasks
1. **Loading** (`components/sections/Loading.tsx`, `docs/10 §1`): tampilkan `illustrations/loading-motif.png`, wreath rotate + breathing; **preload** hero layers (`scenes/hero-bg`, `couple/couple-cutout`, semua `cats/cat-*`) + audio metadata; cross-fade ke Gate saat siap (maks 2s).
2. **Guest link** `lib/guest.ts` (`docs/spec/04 §4`): `readGuest()` + `greeting()` dari `?to=`.
3. **Gate** (`components/sections/Gate.tsx`, `docs/10 §2`, flow `docs/spec/05 §2`):
   - `florals/floral-border-full.png` bingkai (sway), "Kepada, **{Nama}**", tombol "Buka Undangan".
   - **Tap** → (a) `useGyro().enable()` (iOS permission), (b) start audio `audio/la-vie-en-rose.mp3` fade-in (`AudioToggle`/AudioContext, `docs/spec/05 §5`), (c) page-turn/curtain reveal → trigger hero assemble.
   - Reload: skip gate panjang via `sessionStorage.entered` (`docs/spec/05 §2,6`).
   - **Tidak ada kucing di gate** (disimpan untuk hero).
4. **heroLayout.ts** (`docs/09 §1`): posisi `%` tiap layer agar assemble berakhir = komposisi `scenes/hero-main.webp`.
5. **Hero** (`components/hero/Hero.tsx`, `docs/09`, timeline `docs/spec/06 §6`):
   - Layer stack: `hero-bg` (sky/meadow) → `couple-cutout` → 8 `cat-*` → `floral-corner-tl/br` → `Doves` → `Butterflies` → `Particles` → teks.
   - **Assemble timeline** (sky→meadow→couple→cats stagger→florals→doves/butterflies/particles→teks) lalu `startIdle()`.
   - **Idle**: breathing (couple+cats, fase acak), sway florals, awan drift.
   - **Parallax**: `useParallax` (tilt+scroll), exit saat scroll ke Welcome.
   - **Fallback**: tier LOW/REDUCED → tampil `scenes/hero-tall.webp` (poster) atau `hero-main.webp` + fade (`docs/09 §6`).
6. **Doves.tsx / Butterflies.tsx** (`docs/09 §3`, `docs/12`): MotionPath melintas; butterflies wing-flutter; pause off-screen; per-tier.
7. **Headline/teks**: "We are getting married" · Bashara & Hanifah · 22 Agustus 2026 (dari `lib/config.ts`).

## Files created
`components/sections/{Loading,Gate}.tsx` · `components/hero/{Hero.tsx,heroLayout.ts,Doves.tsx,Butterflies.tsx}` · `components/ui/AudioToggle.tsx` · `lib/guest.ts`

## Assets used
`illustrations/loading-motif.png` · `florals/floral-border-full.png` · `scenes/{hero-bg,hero-main,hero-tall}.webp` · `couple/couple-cutout.png` · `cats/cat-{jiro,meng,moju,shiro,simba,hoshi,kimho}.png` · `florals/{floral-corner-tl,floral-corner-br,accent-doves,accent-butterflies}.png` · `audio/la-vie-en-rose.mp3`

## Cross-refs
`docs/09` (hero penuh) · `docs/10 §1–3` · `docs/spec/05 §2` (gate/permission) · `06 §6` (timeline) · `11 §4` (preload/perceived) · `12` (asset motion) · `README` (paths).

## Exit criteria
- [ ] Loading ≤2s, mulus ke Gate, tak nge-blank
- [ ] Gate: nama tamu benar (`?to=` & generik); tap → gyro permission + audio + reveal
- [ ] Hero assemble → idle **tanpa dead-frame**; cats stagger & breathing tak sinkron
- [ ] Tilt+scroll parallax jalan di HP; fallback scroll-only bila denied
- [ ] Tier LOW/REDUCED → fallback flat, tetap indah
- [ ] Reload men-skip gate; audio toggle berfungsi
- [ ] 60fps di mid-tier; assemble komposisi ≈ `hero-main.webp`

→ Lanjut **STAGE 4 — Narrative Sections**.
