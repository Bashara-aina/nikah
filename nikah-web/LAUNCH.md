# LAUNCH — Bashara & Hanifah Wedding Site

This document is the deploy & verification runbook. The site is feature-complete
(Stages 1–7) but the couple must fill in production values and run a smoke
test before sending the link to family.

---

## 1. Pre-flight: production values

Verify every key in `lib/config.ts` is filled in. Empty values log a warning
in dev but render "Segera hadir" in production.

### Apps Script (server-only, NEVER `NEXT_PUBLIC_*`)

- `APPS_SCRIPT_URL` — the deployed Web App URL
- `APPS_SCRIPT_TOKEN` — shared secret validated by `Code.gs`

### Public

- `NEXT_PUBLIC_SITE_URL` — e.g. `https://nikah.bashara-hanifah.id` (used by `metadataBase`, JSON-LD, and the guest link generator)
- `NEXT_PUBLIC_MAPS_URL` — Google Maps shortlink (already has a default)

### Couple TODO (in `lib/config.ts`)

- `couple.hashtag` — already set
- `gift.banks[0]` — Bank Indonesia (name/number/holder)
- `gift.banks[1]` — Bank Japan (name/number/holder)
- `gift.address.id` — physical gift address (Indonesia)
- `gift.address.jp` — physical gift address (Jepang / Japan)
- `livestream.youtube` — YouTube live URL
- `livestream.zoom` — Zoom interaktif URL
- `livestream.instagram[0..1]` — mempelai Instagram
- `livestream.facebook[0..3]` — 4 orang tua Facebook

---

## 2. Deploy to Vercel

### One-time setup

1. Push repo to GitHub.
2. Vercel → **Add New Project** → import the repo.
3. Framework: **Next.js** (auto-detected). Build command, output dir: defaults.
4. Open **Settings → Environment Variables**. Add for **Production** (and Preview if you want):
   - `APPS_SCRIPT_URL`
   - `APPS_SCRIPT_TOKEN`
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_MAPS_URL` (optional — has default)
5. **Settings → Domains** — add the custom domain (e.g. `nikah.bashara-hanifah.id`). Vercel will issue TLS automatically.

### Deploy

```bash
# Option A: via Vercel CLI
npm i -g vercel
vercel link                  # link the repo
vercel env add APPS_SCRIPT_URL
vercel env add APPS_SCRIPT_TOKEN
vercel env add NEXT_PUBLIC_SITE_URL
vercel env pull              # sync to .env.local
vercel deploy                # preview
vercel deploy --prod         # production
```

The first preview URL is enough to do the smoke test below. Promote to
production only after smoke test passes.

---

## 3. Apps Script + Sheet (one-time, before smoke test)

Per `docs/spec/03 §4`:

1. Create a new Google Sheet named **"Bashara & Hanifah — RSVP & Wishes"**.
2. Add tabs `rsvp`, `wishes`, `guests`. Headers (row 1):
   - `rsvp`: `timestamp | guest | nama | kehadiran | jumlah | pesan`
   - `wishes`: `timestamp | nama | pesan | approved`
   - `guests`: `nama | slug | grup | link | opened` (optional)
3. In **Extensions → Apps Script**, paste the Web App code from
   `docs/spec/03 §4` (doPost handles `action: "rsvp"` and `action: "wish"`;
   doGet returns approved wishes). Use the `APPS_SCRIPT_TOKEN` you generated
   earlier.
4. **Deploy → New deployment** → type **Web app**, execute as **Me**, access
   **Anyone**. Copy the Web App URL → `APPS_SCRIPT_URL`.

---

## 4. Smoke test (preview URL)

Open the preview URL on a real phone if possible. Walk through:

1. **Gate** → `?to=Keluarga%20Bapak%20Andi` → name appears correctly → tap
   "Buka Undangan" → page-turn reveal. Audio should start after tap; toggle
   mute works.
2. **Hero** → assemble plays, cats/couple stagger, doves drift.
3. **Welcome** → accent + per-line stagger + Yasin blockquote.
4. **Countdown** → angka roll halus (no snap) tiap detik ke 22 Agt 2026 10:00 WIB.
5. **Story** → 9 baris reveal selang-seling kiri/kanan.
6. **Japan** → sakura ambient aktif di section ini saja.
7. **Event** → tanggal/venue/map link benar; .ics download valid; livestream
   tombol tampil jika `config.livestream` terisi.
8. **RSVP** → submit 1 baris → "Konfirmasi terkirim" → verify row muncul di
   Sheet `rsvp` → delete the row.
9. **Wishes** → submit 1 ucapan → "Terima kasih atas ucapanmu 🤍". If you
   set `approved` default `TRUE` in Apps Script, refresh → the wish appears
   in the public list. If you set it `FALSE`, the wish stays pending (this
   is expected — see `docs/spec/04 §1`).
10. **Gift** → tap "Salin" → toast "Tersalin ✓" → paste in a text field to
    confirm. If `config.gift.banks[0]` is empty, the card shows "Segera
    hadir" and no copy button.
11. **Closing** → cat-peek animates, doves fly up.
12. **Tier LOW** → open `?debug=motion` overlay (only on dev URL) to confirm
    tier is `MID` or `HIGH`. On a throttled connection (`chrome://flags` →
    "force effective-type 2G"), the tier drops to `LOW` and Particles should
    disappear; loops should pause.
13. **Reduced motion** → OS-level reduced-motion ON → entrance & idle
    replaced with fades.

---

## 5. Post-launch monitoring

- Watch Sheet `rsvp` and `wishes` rows. Both have an `approved` column so
  moderation is possible without code changes (set `FALSE` in the Sheet).
- Vercel → Logs shows the API route calls and any 5xx from Apps Script.
- Rollback: Vercel → Deployments → **Promote to Production** the previous
  deployment (instant).

---

## 6. Local development

```bash
cd nikah-web
npm install
npm run dev          # http://localhost:3000 (or 3001 if 3000 taken)
```

Useful dev URL params:

- `/?to=Keluarga+Bpk+Andi` — personalized gate
- `?debug=motion` — motion preview + tier/fps/scrolltrigger count overlay

Useful scripts:

- `npm run dev` — dev server
- `npm run build` — production build (verifies)
- `npm run lint` — eslint
- `npm run type-check` — tsc
- `npm run copy-assets` — refresh `public/assets/` from `../assets/`

---

## 7. File map (new in Stages 4–7)

```
nikah-web/
├── app/
│   ├── api/
│   │   ├── rsvp/route.ts         # POST /api/rsvp (Stage 5)
│   │   └── wishes/route.ts       # GET/POST /api/wishes (Stage 5)
│   ├── page.tsx                  # section orchestration + dynamic() (Stage 6)
│   ├── layout.tsx                # JSON-LD Event, skip-link, providers
│   ├── robots.ts                 # /robots.txt (Stage 6)
│   └── sitemap.ts                # /sitemap.xml (Stage 6)
├── components/
│   ├── sections/
│   │   ├── Welcome.tsx           # Stage 4
│   │   ├── Countdown.tsx         # Stage 4 — Hari·Jam·Menit·Detik roll
│   │   ├── Story.tsx             # Stage 4 — alternating left/right
│   │   ├── Japan.tsx             # Stage 4 — sakura ambient
│   │   ├── Closing.tsx           # Stage 4 — mini-assemble + cat-peek
│   │   ├── Event.tsx             # Stage 5 — venue/map/.ics/livestream
│   │   ├── Rsvp.tsx              # Stage 5 — form + state machine
│   │   ├── Wishes.tsx            # Stage 5 — form + list + optimistic
│   │   └── Gift.tsx              # Stage 5 — banks + address + FAQ
│   └── ui/
│       ├── Pill.tsx              # Stage 5 — radio-style choice
│       ├── Field.tsx             # Stage 5 — underline + floating label
│       ├── Accordion.tsx         # Stage 5 — transform/opacity reveal
│       ├── StickyRsvp.tsx        # Stage 6 — Lenis scrollTo, hide near RSVP
│       └── ScrollTop.tsx         # Stage 6 — Lenis scrollTo top
└── lib/
    ├── ics.ts                    # Stage 5 — build & download .ics
    ├── sheets.ts                 # Stage 5 — server-side Apps Script proxy
    ├── rateLimit.ts              # Stage 5 — in-memory token bucket
    ├── useWishes.ts              # Stage 5 — client fetch + cache
    └── toastStore.tsx            # Stage 5 — global toast + aria-live
```

---

## 8. Known gaps & follow-ups

Tracked in `TODO.md`:

- `public/og/og-cover.jpg` not generated.
- `apple-touch-icon.png` + `site.webmanifest` not shipped (metadata references
  them; replace before launch for clean share preview).
- `scripts/gen-links.ts` (CSV → `?to=` URLs) not implemented.
- Gallery (lightbox) was scoped to Stage 6 in the runbook. ✅ **Shipped in
  this iteration** — `components/sections/Gallery.tsx` uses all 9 prewedding
  photos (`gallery-01..09.jpg`) with scrapbook scatter-in entrance (per
  docs/12 §Gallery), `gallery-frame.png` overlay, asymmetric floral corners,
  tap-to-open lightbox with Esc-to-close + body-scroll-lock + focus restore.
  Placed between `Japan` and `Event` so the romantic story arc pays off
  visually before the practical info sections.
- Manual override of `?to=` → guest name dictionary (slug → nama) is not
  yet implemented. Current `?to=` accepts the raw name only.

---

Last updated: build verified locally (lint, type-check, production build all
green). Ready to deploy to a preview Vercel project.
