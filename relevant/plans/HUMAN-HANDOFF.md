# Human handoff — what Claude Fable shipped vs what only you can finish

**Date:** 2026-07-18  
**App package:** `nikah-web/` (package name still `nikah-web`)  
**Deltas:** [DELTA.md](./DELTA.md)

---

## Already done (agent)

- Keepers remediated → `nikah-web/assets/` → mirrored to `nikah-web/public/assets/`
- Full L1–L12 invitation UI (gate-first unlock; no separate envelope)
- Living hero loop + painted-sky extension
- RSVP + wishes API routes (503 until `APPS_SCRIPT_URL` is set)
- Guest-link generator: `nikah-web/scripts/generate-guest-links.mjs`
- type-check / lint green (verified after Fable session)
- Plan deltas documented

**Run locally:**

```bash
cd asset
npm install          # if needed
npm run dev          # predev copies assets
# open http://localhost:3000/?to=Keluarga%20Andi
```

**Guest links (after domain is set):**

```bash
cd asset
cp guests.example.csv guests.csv   # edit names
# set NEXT_PUBLIC_SITE_URL in .env first
npm run guest-links -- guests.csv > links.csv
```

---

## You must provide (do not invent)

Fill `nikah-web/lib/config.ts` + `nikah-web/.env` when ready:

| # | Item | Where |
|---|------|--------|
| 1 | `APPS_SCRIPT_URL` after Apps Script deploy | `nikah-web/.env` |
| 2 | Bank Indonesia: bank · rekening · atas nama | `siteConfig.bank.id` |
| 3 | Bank Japan: bank · account · name | `siteConfig.bank.jp` |
| 4 | Gift mailing address | `siteConfig.bank.giftAddress` |
| 5 | Livestream URLs (YT / Zoom / IG / FB) | `siteConfig.livestream` |
| 6 | Final domain | `NEXT_PUBLIC_SITE_URL` in `.env` + `siteConfig.siteUrl` |

Until then, gift / livestream UI correctly shows **"Informasi menyusul."**

---

## Eyeball checklist (phones)

- [ ] **GG-Hero** — living loop matches `hero-main` family/light; names stay in sky, not on faces
- [ ] **GG-World** — ivory continuous scroll L1→L12 feels like one book
- [ ] **ch04 v2** — Tokyo Tower + sakura present? Approve or roll back (see DELTA.md)
- [ ] Gate `?to=` personalization + fallback without param
- [ ] Audio unlock on "Buka Undangan"; mute toggle persists
- [ ] RSVP submit → honest 503 until Sheets wired; then real write
- [ ] Throttled 3G + `prefers-reduced-motion`

**ch04 rollback** (if you reject v2): restore original into shipping via remediate from `relevant/04-story/story-ch04-ldr-tokyo.webp` (not `-v2`), then `npm run copy-assets`.

---

## Git / deploy (ask before agent does)

Nothing is committed yet from this build unless you request it. When ready:

1. Branch `feature/invitation-scaffold` (or similar) — never commit straight to `main`
2. Conventional commits (assets / feat UI / chore scripts)
3. Vercel project rooted at `nikah-web/` (or document root directory)
4. Set env: `NEXT_PUBLIC_SITE_URL`, `APPS_SCRIPT_URL`, `FAL_KEY` (scripts only — not needed at runtime for guests)

---

## Open product defaults Fable already took

| Decision | Default taken |
|----------|----------------|
| L0 | Gate-first (no CSS envelope) |
| Closing | `closing-couple-and-cats` + Hoshi peek |
| Scrapbook | After ch06, 4 photos |
| Japan copy | Textless visual (no invented copy) |
| Music icons | Inline SVG (opaque keepers not shipped) |
