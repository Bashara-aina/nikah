# STAGE 6 — Polish, Butter & Accessibility

## Goal
Semua section ada → sekarang **haluskan**: tier fallback menyeluruh, microinteractions lengkap, smooth-scroll/perf tuning ("butter"), aksesibilitas, responsive/desktop, SEO/OG/favicon, gallery lightbox, utilitas.

## Prereq
Stage 1–5 (semua section & backend fungsional).

## Tasks
1. **Tier & reduced-motion sweep** (`docs/08 §7`, `docs/spec/11 §8`): pastikan SETIAP komponen menghormati HIGH/MID/LOW/REDUCED — particles/tilt/loops/parallax mati anggun; fallback flat hero. Uji `prefers-reduced-motion`.
2. **Microinteractions** (`docs/spec/10 §2`): lengkapi semua reaksi <100ms — tombol, pill, input (underline grow, float label, realtime validate), stepper jumlah, copy-rekening toast, FAQ chevron, audio toggle, sticky/scrolltop, haptik halus. Varian reduced-motion (`docs/spec/10 §7`).
3. **Smooth-scroll/perf (butter)** (`docs/spec/11`): tune Lenis; transform/opacity-only audit; `will-change` dipasang/dilepas; **pause off-screen** semua loop+particles+paths; `content-visibility:auto` section bawah; lazy-mount gallery lightbox & map iframe; preload hero/font; bundle < ~150KB gz; satu RAF.
4. **Gallery** (`components/sections/`? — taruh di Story/Closing atau section galeri opsional): foto `gallery/gallery-01..09.jpg` scrapbook (rotate acak + `gallery-frame.png`), **lightbox** (fade+scale, swipe, focus-trap, tutup tap-luar/✕) — lazy/dynamic import.
5. **Responsive/desktop** (`docs/spec/02 §5`, `12 §6`): kartu terpusat di desktop; hero full-bleed; gallery 2–3 kolom; tap target ≥44px; uji zoom 200%.
6. **SEO/OG/share** (`docs/spec/07`): metadata final; buat `public/og/og-cover.jpg` (1200×630 dari `scenes/hero-card`/`hero-main` + nama+tanggal); favicon/apple-icon/manifest/theme-color; robots/sitemap; (opsional) JSON-LD Event, Web Share.
7. **Utilities**: `ScrollTop`, (opsional) progress hairline (`docs/spec/12 §5`), AudioToggle persist localStorage; Toast `aria-live`.
8. **A11y pass** (`docs/spec/13 §2`): kontras AA (cek pasangan warna), fokus ring & urutan, label form + `aria-describedby` error, `aria-live` status, alt deskriptif, `lang=id`, semantik heading, tak ada hover-only penting.

## Files touched/created
`components/ui/{ScrollTop,Lightbox,Progress?}.tsx` · `app/{robots.ts,sitemap.ts}` · `public/og/og-cover.jpg` · `public/{favicon.png,apple-touch-icon.png,site.webmanifest}` · audit lintas semua komponen.

## Assets used
`gallery/gallery-01..09.jpg` · `illustrations/gallery-frame.png` · `scenes/hero-card.webp`/`hero-main.webp` (untuk OG) · favicon motif.

## Cross-refs
`docs/08 §7,8` · `docs/spec/07` (SEO/OG) · `09` (komponen/states) · `10` (microinteraction+reduced) · `11` (butter penuh) · `12 §5–6` (nav/desktop) · `13 §1–4` (heuristik+a11y+motion-safety) · `docs/12` (asset motion).

## Exit criteria
- [ ] Reduced-motion & tier LOW: seluruh situs anggun & terbaca (diuji HP lemah nyata)
- [ ] Semua microinteraction <100ms ack; form ramah; toast/haptik jalan
- [ ] Butter: 60fps scroll mid-tier; LCP<2.5s(3G); CLS<0.05; INP<200ms; bundle target
- [ ] Gallery lightbox lazy, focus-trap, swipe, tutup benar
- [ ] Desktop/responsive rapi; zoom 200% tak pecah
- [ ] OG tampil baik di WhatsApp; favicon/manifest ada
- [ ] A11y: kontras AA, keyboard, SR labels, aria-live (`docs/spec/13 §2` checklist)
- [ ] Lighthouse mobile perf & a11y ≥ 90

→ Lanjut **STAGE 7 — QA, Launch & Post-launch**.
