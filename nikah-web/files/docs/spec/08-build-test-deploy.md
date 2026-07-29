# SPEC 08 — Build, Test & Deploy

Workflow engineering dari nol sampai rilis. Untuk Cursor / Claude Code.

---

## 1. Prasyarat
- Node LTS (≥20), pnpm/npm. Akun Vercel. Google account (Sheet + Apps Script).
- Aset siap di `/assets` (sudah). Akan disalin ke `public/assets`.

## 2. Scaffold (langkah)
```bash
npx create-next-app@latest nikah-web --ts --app --tailwind --eslint
cd nikah-web
npm i gsap @studio-freight/lenis zod
# (opsional) npm i @vercel/analytics
```
- Set `next/font`, palet CSS vars di `globals.css`, `lib/config.ts`, `lib/motionTokens.ts`.
- **Asset pipeline**: `scripts/copy-assets.mjs` menyalin `../assets/{scenes,cats,couple,florals,illustrations,gallery,audio}` → `public/assets/...` (jangan ikutkan `_source`). Jalankan di `prebuild` & `predev`.
  ```json
  "scripts": { "predev":"node scripts/copy-assets.mjs", "prebuild":"node scripts/copy-assets.mjs" }
  ```

## 3. Env vars
| Key | Scope | Isi |
| :-- | :-- | :-- |
| `APPS_SCRIPT_URL` | server | URL web app |
| `APPS_SCRIPT_TOKEN` | server | shared secret |
| `NEXT_PUBLIC_SITE_URL` | public | https domain |
| `NEXT_PUBLIC_MAPS_URL` | public | maps.app.goo.gl/... |
- `.env.local` (dev) tidak di-commit. Set juga di Vercel (Preview & Production).

## 4. Konvensi kode
- TypeScript strict. Komponen kecil & terfokus (section contract SPEC 02).
- Animasi hanya via primitives/hooks (`docs/12`, SPEC 06) — jangan animasi liar di komponen.
- Tidak ada teks hardcode (SPEC 07). Tidak ada angka magic motion (pakai `motionTokens`).
- Path alias `@/` → root. Lint + format (eslint + prettier) wajib lulus.

## 5. Build order (rekomendasi, increment teruji)
1. Shell: layout, font, palet, MotionProvider+useTier, Lenis. Render placeholder section.
2. `config.ts` + asset pipeline + primitives (Reveal/Breathing/Sway/Stagger).
3. **Hero** (SPEC 06 §6, `docs/09`) → uji di HP nyata (bukti gerak).
4. Gate + audio + guest link + permission flow (SPEC 05 §2).
5. Section berurutan: Welcome → Countdown → Story → Japan → Event → RSVP → Wishes → Gift → Closing (`docs/10`).
6. Backend: Apps Script deploy + Sheet + `/api/rsvp` + `/api/wishes` (SPEC 03) + validasi.
7. Particles/doves/butterflies + tier gating menyeluruh (`docs/12`).
8. Polish: reduced-motion, fallback flat hero, a11y, SEO/OG, ics, sticky/scrolltop/toast.
9. Hardening: error/offline/retry, rate-limit, sanitasi.

## 6. Testing strategy
| Lapis | Cara |
| :-- | :-- |
| Unit | `lib/` murni: validation (zod), guest decode, ics, formatTanggal — Vitest |
| Komponen | render Section, cek konten & a11y (Testing Library) |
| API | route handler: valid/invalid/honeypot/rate-limit (mock Apps Script) |
| Visual/motion | manual + Playwright screenshot per section; cek no-CLS |
| Device matrix | iOS Safari (gyro), Chrome Android, **1 HP low-end nyata** (tier LOW), desktop |
| Kondisi | `prefers-reduced-motion` ON; throttle 3G; offline submit; tanpa `?to=` |
| Perf | Lighthouse mobile (gate rilis: perf & a11y ≥ 90), CLS<0.05, LCP<2.5s |

Smoke test RSVP/Wishes ke Sheet "test" sebelum prod.

## 7. CI (opsional, ringan)
- GitHub Actions: install → lint → typecheck → unit → build. Vercel auto-preview per PR.

## 8. Deploy (Vercel)
- Connect repo → import. Set env (Preview+Prod). Framework auto (Next).
- Apps Script: dua deployment (test untuk preview, prod untuk production) atau satu + tab terpisah.
- Domain custom (opsional) → set `NEXT_PUBLIC_SITE_URL`.
- Verifikasi: buka preview di **HP asli**, tes gate→audio→gyro→RSVP→wishes.

## 9. Launch checklist (sebelum sebar link)
- [ ] `config.ts` TODO terisi: no. rekening (ID & JP), alamat hadiah, link livestream (YT/Zoom/IG/FB)
- [ ] Copy final dari `docs/03` masuk semua section
- [ ] OG image `og-cover.jpg` (1200×630) tampil benar di WhatsApp
- [ ] Favicon/apple-icon/manifest/theme-color
- [ ] RSVP & Wishes tertulis ke Sheet prod (uji 1 baris, lalu hapus)
- [ ] Deadline RSVP D-7 tampil; perilaku setelah lewat ditentukan
- [ ] **Guest link generator** jalan: daftar nama → daftar URL `?to=` (SPEC 04 §4)
- [ ] Audio start setelah tap; toggle mute jalan
- [ ] Map benar (Widuri Restaurant, lantai 2, dekat Gedung Sate)
- [ ] Tes tier LOW & reduced-motion di HP lemah
- [ ] Lighthouse mobile ≥ 90; tidak ada error console
- [ ] Etiquette & livestream akurat

## 10. Post-launch
- Pantau Sheet RSVP/Wishes; moderasi wishes bila perlu (`approved`).
- Analytics ringan (opsional): jumlah pembuka, RSVP rate.
- **Pasca-acara**: section galeri bisa ditambah foto hari-H (struktur `gallery/` sudah siap); thank-you note opsional.
- Rollback: Vercel instant rollback ke deployment sebelumnya bila ada masalah.

---

## Peta dokumen (ringkasan "main 8")
1. System Architecture · 2. Frontend · 3. Backend/API · 4. Data Model · 5. User Flows · 6. Motion Integration · 7. Content/SEO/Share · 8. Build/Test/Deploy.
Konteks kreatif & gerak detail: `docs/01–12`. Manifest aset: `/README.md`.
