# TODO — values the couple must provide before launch

The app **builds and runs** with empty placeholders; below are the production
values that need to be filled in. Each one logs a dev-only warning at runtime.

## Stage 5 — Backend

- [ ] **Google Apps Script Web App URL** → set env `APPS_SCRIPT_URL` on Vercel (server-only, never `NEXT_PUBLIC_*`).
- [ ] **Shared token** → set env `APPS_SCRIPT_TOKEN` (server-only).
- [ ] Google Sheet created with tabs `rsvp`, `wishes`, `guests` per `docs/spec/04 §1` (header row matches schema).
- [ ] Apps Script `Code.gs` deployed: `doPost` handles `action: "rsvp"` and `action: "wish"`; `doGet` returns approved wishes.
- [ ] Smoke-test RSVP+Wishes against production deployment (send 1 row → verify in Sheet → delete).

## Stage 4/5 — Gift

- [x] Bank Indonesia (bank name, account number, account holder) — `config.gift.banks[0]`.
- [x] Bank Jepang / JP (bank name, account number, account holder, branch) — `config.gift.banks[1]`.
- [ ] Physical gift address (Indonesia) — `config.gift.address.id`.
- [ ] Physical gift address (Jepang) — `config.gift.address.jp`.

## Stage 4 — Livestream

- [ ] YouTube live URL — `config.livestream.youtube`.
- [ ] Zoom interaktif URL — `config.livestream.zoom`.
- [ ] Instagram (mempelai) URLs — `config.livestream.instagram[0..1]`.
- [ ] Facebook (4 orang tua) URLs — `config.livestream.facebook[0..3]`.

## Stage 7 — Production

- [ ] **Production domain** → set env `NEXT_PUBLIC_SITE_URL` (used for `metadataBase` + guest link generator).
- [ ] **Custom domain** (opsional) configured in Vercel.
- [ ] `public/og/og-cover.jpg` (1200×630, <300KB) rendered correctly in WhatsApp preview.
- [ ] Favicon, apple-touch-icon, site.webmanifest generated (Stage 6).

## Stage 7 — Surfaced in this build

- [ ] `public/favicon.ico` already exists from `create-next-app` (default Next.js). Replace with a wedding motif if desired (SPEC 07 §5). `apple-touch-icon.png` and `site.webmanifest` not yet shipped — metadata references them but they 404 silently.
- [ ] `og-cover.jpg` not yet generated. Metadata references `/og/og-cover.jpg`; preview cards will fall back until the asset is added.
- [ ] Guest link generator `scripts/gen-links.ts` not yet implemented (deferred to first launch run).
- [ ] JSON-LD `Event` is emitted from `app/layout.tsx`; verify it renders in Google's Rich Results test once deployed.

## Tracking

Run `npm run dev` and watch the dev console — `warnTodo()` flags any empty
TODO key still in `lib/config.ts`.