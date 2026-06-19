# STAGE 1 — Foundation & Setup

> **The 7-stage runbook** (execute in order): **1 Foundation** → 2 Motion Engine → 3 Entry (Loading/Gate/Hero) → 4 Narrative Sections → 5 Functional + Backend → 6 Polish/Butter/A11y → 7 QA & Launch.
> Each stage lists: Goal · Prereq · Tasks · Files · Assets · Cross-refs · **Exit criteria**. Do not advance until exit criteria pass.

---

## Goal
Project berdiri, dependency siap, token/konfig/aset terpasang, dan kerangka halaman render — fondasi untuk semua stage berikutnya.

## Prereq
- Aset final ada di `/assets` (lihat `/README.md`). Node ≥20, akun Vercel & Google.

## Tasks
1. **Scaffold** (lihat `docs/spec/08 §2`):
   ```bash
   npx create-next-app@latest nikah-web --ts --app --tailwind --eslint
   cd nikah-web && npm i gsap @studio-freight/lenis zod
   ```
2. **Asset pipeline** — `scripts/copy-assets.mjs` salin `../assets/{scenes,cats,couple,florals,illustrations,gallery,audio}` → `public/assets/...` (TANPA `_source`). Hook `predev`/`prebuild` (`docs/spec/08 §2`).
3. **Palette CSS vars** di `app/globals.css` (semua var dari `docs/spec/09 §1`): `--ivory…--ink`.
4. **Fonts** via `next/font`: serif display + sans body (`docs/spec/07 §8`, pilihan di `docs/spec/09 §2`). `display:swap`, preload heading.
5. **Tokens** `lib/motionTokens.ts` = easing/durasi/jarak/stagger persis `docs/08 §3` (SATU sumber).
6. **Config** `lib/config.ts` = struktur lengkap acara dari `docs/spec/04 §5` (isi data; tandai TODO: rekening, alamat hadiah, livestream).
7. **Types & validation** `lib/types.ts`, `lib/validation.ts` (zod) dari `docs/spec/04 §2–3`.
8. **MotionProvider + useTier** (`docs/spec/06 §3`, `docs/08 §7`) + **Lenis provider** (`docs/spec/06 §2`, tuning `docs/spec/11 §1`) dipasang di `app/layout.tsx`.
9. **Metadata/OG/favicon** dasar di `layout.tsx` (`docs/spec/07 §3,5`).
10. **Page skeleton** `app/page.tsx`: render placeholder `<section>` untuk 11 bagian (urutan `docs/spec/12 §3`) agar scroll & provider teruji.

## Files created
`scripts/copy-assets.mjs` · `app/layout.tsx` `app/page.tsx` `app/globals.css` · `lib/{config,motionTokens,types,validation}.ts` · `components/motion/{MotionProvider.tsx,useTier.ts,Lenis.tsx}`

## Assets used
Semua via `public/assets/**` (hasil pipeline). Verifikasi struktur cocok `/README.md`.

## Cross-refs
`docs/spec/01` (arsitektur), `02` (struktur frontend), `04` (config/data), `06 §2–3` (provider), `07 §3,8`, `08 §2–4`, `09 §1–2`, `11 §1`, `docs/08 §3,7`.

## Exit criteria
- [ ] `npm run dev` jalan; aset tampil dari `/public/assets`
- [ ] Lenis smooth scroll aktif; placeholder 11 section ter-scroll
- [ ] `useTier()` mengembalikan tier benar (cek `?debug=motion` nanti)
- [ ] Font & palet termuat; tak ada error console; build sukses
- [ ] `lib/config.ts` terisi (TODO ditandai jelas)

→ Lanjut **STAGE 2 — Motion Engine & Primitives**.
