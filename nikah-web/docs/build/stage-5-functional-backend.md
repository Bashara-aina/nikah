# STAGE 5 — Functional Sections & Backend

## Goal
Bangun bagian interaktif + persistensi: **Event** (peta/kalender/etiket/livestream), **RSVP** (+ `/api/rsvp`), **Wishes** (+ `/api/wishes`), **Gift + FAQ**. Hubungkan ke **Google Sheet via Apps Script**.

## Prereq
Stage 4. Sheet + Apps Script disiapkan (lihat Tasks 1).

## Tasks
1. **Backend infra** (`docs/spec/03`, `04 §1`):
   - Buat Google Sheet: tab `rsvp`, `wishes`, `guests` (+ header, `docs/spec/04 §1`).
   - Deploy **Apps Script Web App** (`docs/spec/03 §4`, `doPost`/`doGet`, token). Simpan URL → env `APPS_SCRIPT_URL`, `APPS_SCRIPT_TOKEN` (`docs/spec/01 §5`).
   - `lib/sheets.ts` (`postAppsScript`) + `lib/useWishes.ts` (fetch+cache).
2. **API routes** (`docs/spec/03 §2–3,5`): `app/api/rsvp/route.ts`, `app/api/wishes/route.ts` (GET+POST) — validasi zod (`lib/validation.ts`), rate-limit, honeypot, timeout+retry, proxy ke Apps Script (sembunyikan URL).
3. **Event** (`components/sections/Event.tsx`, `docs/10 §8`, `docs/02`):
   - `illustrations/event-accent.png` membingkai tanggal/venue (dari `config.venue`).
   - **Peta**: tombol + `illustrations/map-pin.png` (drop+bounce, pulse) → buka `config.venue.mapsUrl`; embed iframe **lazy** saat section masuk (`docs/spec/11 §5`).
   - **Save to Calendar** `lib/ics.ts` (`docs/spec/03 §7`) → unduh `.ics`.
   - **Etiquette** list (5 butir, `config.etiquette`), **dress code** pastel, **livestream** (YouTube/Zoom/IG/FB dari `config.livestream`) sebagai tombol.
4. **RSVP** (`components/sections/Rsvp.tsx`, flow `docs/spec/05 §3`, UI `docs/spec/09 §5`, interaksi `docs/spec/10 §3`):
   - Field: nama, kehadiran pill (Hadir/Tidak/Diusahakan), jumlah 1–4 (muncul jika Hadir, clamp), pesan. Deadline **D-7** tampil.
   - Submit → `/api/rsvp` → state machine (success petal-burst / error / 429 / offline-queue).
   - **Sticky RSVP** (`components/ui/StickyRsvp.tsx`) + smooth `scrollTo`.
5. **Wishes** (`components/sections/Wishes.tsx`, `docs/10 §10`, `docs/spec/05 §4`):
   - Form (nama, pesan) → `/api/wishes` POST (optimistic prepend). List publik via `useWishes` (GET, sanitasi+escape). Empty & skeleton state (`docs/spec/05 §7`).
6. **Gift** (`components/sections/Gift.tsx`, `docs/10 §11`):
   - `illustrations/gift-accent.png`; nada **apresiatif, tidak memaksa** (`docs/03`).
   - Bank **Indonesia & Jepang setara** + alamat hadiah (accordion); tombol **Salin rekening** + toast (`docs/spec/10 §2`).
   - **FAQ** accordion (`components/ui/Accordion.tsx`) termasuk hadiah/anak/parkir/livestream.

## Files created
`app/api/{rsvp,wishes}/route.ts` · `lib/{sheets,useWishes,ics}.ts` · `components/sections/{Event,Rsvp,Wishes,Gift}.tsx` · `components/ui/{StickyRsvp,Accordion,Toast,Field,Pill}.tsx` · Apps Script `Code.gs`

## Assets used
`illustrations/{event-accent,map-pin,gift-accent}.png` · `florals/floral-sprig.png` (kartu RSVP) · `florals/drapery-divider.png`

## Cross-refs
`docs/spec/03` (API+Apps Script) · `04` (data/config/validation) · `05 §3–7` (flows/edge) · `09 §5` (komponen) · `10 §2–3` (interaksi form) · `11 §5` (lazy map) · `docs/10 §8–11` (choreo) · `docs/03` (copy & gift tone).

## Exit criteria
- [ ] RSVP tersimpan ke Sheet `rsvp`; validasi+clamp 1–4; sukses/err/429/offline tertangani
- [ ] Wishes terkirim ke Sheet `wishes` & tampil (sanitasi); empty/skeleton/prepend
- [ ] Event: tanggal/jam/venue akurat; peta benar; `.ics` valid; etiquette lengkap; livestream link
- [ ] Gift: bank ID & JP + alamat; salin+toast; FAQ accordion halus
- [ ] Secrets server-only; honeypot+rate-limit aktif; timeout+retry
- [ ] Sticky RSVP perilaku benar (muncul/sembunyi, keyboard)

→ Lanjut **STAGE 6 — Polish, Butter & Accessibility**.
