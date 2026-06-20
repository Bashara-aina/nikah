# STAGE 2 — Motion Engine & Primitives

## Goal
Bangun sistem gerak reusable (hooks + primitives + particles) yang menegakkan aturan "hidup, bukan kaku" dan tier fallback — supaya semua section tinggal pakai, konsisten.

## Prereq
Stage 1 selesai (MotionProvider, useTier, Lenis, tokens).

## Tasks
1. **GSAP setup** (`docs/spec/06 §2`): register `ScrollTrigger`, `MotionPathPlugin`; satu RAF global (Lenis + ScrollTrigger.update + parallax + particles); `ScrollTrigger.refresh()` setelah aset/font hero load.
2. **useGyro()** (`docs/spec/06 §4`, `docs/08 §5`): DeviceOrientation + `requestPermission()` (dipanggil saat tap Gate di Stage 3), lerp 0.08, output `{x,y}` ter-normalisasi; nol bila REDUCED/denied.
3. **useParallax(layers)** (`docs/spec/06 §4`, depth tiers `docs/08 §4`): gabung scroll progress + gyro → `translate3d`; pause off-screen; no-op REDUCED.
4. **useReveal(ref,opts)** (`docs/08`-style, pola `docs/10 §0`): ScrollTrigger `top 80%`, entrance opacity+y, stagger anak; REDUCED → opacity-only.
5. **Primitives** (`docs/spec/02 §2`): `Reveal`, `Breathing`, `Sway`, `Stagger`, `FloatLoop` — semua baca `useMotion()`, terima `seed` untuk **randomisasi organik** (anti-sinkron, `docs/08 §2,5`), auto-pause off-screen, `will-change` dipasang/dilepas (`docs/spec/11 §2`).
6. **Particles.tsx** (`docs/12 §particle config`, `docs/spec/11 §3`): satu `<canvas>`, RAF, count per tier (HIGH 12–14 / MID 6 / LOW 0), petal pastel jatuh+sway+spin recycle; pause `document.hidden` & off-screen; varian palet sakura untuk Japan.
7. **Debug overlay** (`docs/spec/06 §9`): `?debug=motion` → tampil tier, fps, jumlah ScrollTrigger, jumlah particle.

## Files created
`components/motion/{useGyro.ts,useParallax.ts,useReveal.ts,Particles.tsx,debug.tsx}` · `components/primitives/{Reveal,Breathing,Sway,Stagger,FloatLoop}.tsx` · `lib/seed.ts` (random seeded)

## Assets used
Belum (diuji dengan kotak dummy). Particles tidak butuh aset (canvas-drawn) atau pakai sprite kecil opsional.

## Cross-refs
`docs/08` (prinsip & token, §2,4,5,7,8) · `docs/12` (particle config) · `docs/spec/02 §2`, `06 §2,4,9`, `11 §1–3`.

## Exit criteria
- [ ] Dummy box: Reveal/Breathing/Sway jalan, **tidak sinkron** (seed beda), pause saat off-screen
- [ ] useParallax merespons scroll; tilt diuji di HP (gyro) — fallback scroll-only bila denied
- [ ] Particles render & berhenti saat tab hidden / off-screen; count berubah per tier
- [ ] REDUCED-motion: semua primitive → fade/no-op
- [ ] `?debug=motion` menampilkan metrik; 60fps pada dummy
- [ ] Tidak ada memory leak (cleanup `kill()`/destroy saat unmount)

→ Lanjut **STAGE 3 — Entry: Loading, Gate, Hero**.
