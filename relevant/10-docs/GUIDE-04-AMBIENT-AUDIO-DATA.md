# GUIDE 04 — AMBIENT BREATH, AUDIO & DATA

> **Act 3 (The Breath).** The world never stops being alive — petals fall, doves drift, and La Vie en Rose plays through every section. Plus the functional spine: RSVP, Wishes, Gift, and the Closing that echoes the hero.
> **Prerequisite:** [GUIDE 01–03](GUIDE-01-FAL-ASSET-ENGINE.md) complete.

> ## ⭐ EVERYTHING ADJUSTS TO `nikah-web/scenes/hero-main.webp`
> The ambient layer is the *air* of the master's world ([defined in GUIDE 01](GUIDE-01-FAL-ASSET-ENGINE.md#-the-master-visual-anchor--nikah-webscenes-hero-mainwebp)): petal colors, dove style, and the Closing scene all come straight from `hero-main.webp`. The **Closing deliberately returns to the master's world** (couple + cats breathing again) so the book closes where it opened. Form surfaces (RSVP/Wishes/Gift) sit on the master's ivory palette. Match it.

Two layers in this guide: (1) the **persistent ambient systems** that make the page feel like one continuous living world, and (2) the **data + content sections** (RSVP, Wishes, Gift, Closing). Backend writes go to **Google Sheets via Apps Script**; the Next.js route `app/api/rsvp/route.ts` already exists and forwards to `APPS_SCRIPT_URL`.

---

## PART A — AMBIENT SYSTEMS

Build one `AmbientLayer` that wraps the whole page (mounted once in `app/page.tsx`, above sections). It owns five persistent systems and a single shared RAF.

```
components/sections/shared/AmbientLayer.tsx   // wraps page, manages all ambient systems
  ├─ ParticleCanvas      // fixed petal canvas (shared with hero or one instance below)
  ├─ AmbientDoves        // post-hero dove flyovers
  ├─ AudioManager        // persistent <audio> + toggle (see Part B)
  └─ ScrollProgress      // top progress line
```

### A.1 Persistent particle canvas
- One `<canvas>` fixed to the viewport, `pointer-events:none`, behind text / above backgrounds, `opacity ≤ 0.8`.
- Reuse the hero `Particles.tsx` engine; don't fork the loop. Particle type `{x,y,vx,vy,size,rot,vrot,swayPhase,opacity,color}`. Spawn top, drift down (`vy 8–20px/s`), sway `sin(t*0.5+phase)`, slow spin, fade near bottom, recycle.
- Counts via `tierBudget(tier).petals` → 14 HIGH / 6 MID / 0 LOW / 0 REDUCED.
- Colors from palette: blush / cream / soft peach. **Expose `setParticleTheme("sakura"|"default")`** — the Japan section (GUIDE 03 §4) flips to sakura pink + 2 and reverts on exit.
- Pause on `document.visibilitychange` (hidden tab) and when the canvas is off-screen. One RAF total.

### A.2 Ambient doves between sections
- After the hero, 1–2 doves drift across whatever is visible every ~20s (not tied to a section). Same GSAP `MotionPath` bezier as the hero `Doves`. MID: 1 dove, ~40s. LOW/REDUCED: disabled (`tierBudget(tier).doves === 0`).

### A.3 CSS breathing on illustrations
- Every in-view illustration PNG gets a gentle breathing loop via a `breathing-element` class: `@keyframes` translateY ±3px + scale 1→1.01, with `animation-duration` set per element from an inline CSS var randomized 4000–7000ms (a `useAmbientBreathing` hook assigns durations on mount so nothing is synchronized).
- IntersectionObserver adds the class when visible, removes when off-screen (saves CPU).
- **Do not** apply this to fal-video characters — they already breathe (`README.md` hard rule).

### A.4 Drapery ripple
- Section dividers (`florals/drapery-divider.png`): `@keyframes drapery-ripple` shifts a gradient mask horizontally + micro `scaleY` (1→1.003). Cheap, CSS-only.

### A.5 Scroll progress line
- 2px blush line pinned to viewport top, `scaleX` 0→1 from `transform-origin:left` as the guest scrolls top→bottom. Pure CSS/`transform`. Hidden on LOW/REDUCED.

---

## PART B — AUDIO (the heartbeat)

`docs/11 §7`, `docs/12 Audio`, `siteConfig.audio`.
- One persistent `<audio className="site-audio" loop preload="none" src={siteConfig.audio.src}>` mounted in `app/layout.tsx` (so it survives section mounts). `AudioManager` owns its state.
- **Start only after the gate tap** (GUIDE 02 A.1 already does the GSAP fade 0→`fadeTarget` over `fadeInMs`). iOS-compliant: no autoplay before gesture.
- **Persistent toggle** (sticky, top-right, subtle icon), `role="button"`, `aria-label="Putar/Hentikan musik"`, ≥44×44px. It also "breathes" (CSS scale 1→1.03 loop). Persist on/off in `localStorage`; restore on revisit (but never auto-*start* without a prior gesture in the session).
- Muting toggles only audio — all visual motion continues. On REDUCED, audio still allowed (it's not motion), but keep the toggle obvious.
- **Music-note easter egg** (optional, GUIDE 05): one floating note rises from the toggle once, at the Japan chapter.

---

## PART C — DATA SECTIONS

### C.1 RSVP (`docs/02 §7`, `docs/03 §7`, `docs/05 §2`)
- Card form. Fields: **nama**, **kehadiran** (Hadir / Tidak Hadir / Masih Diusahakan), **jumlah hadir** (1–4, capped: 1 invite = 2 people; with kids max 4), **ucapan singkat** (optional). Deadline **D-7 = 15 Agustus 2026** shown clearly.
- Guest name pre-fills from `?to=` (via `lib/guest.ts`); `slug`/`guest` carried through.
- **Validate client + server.** The server route `app/api/rsvp/route.ts` already validates `name` + `attendance` and forwards to `APPS_SCRIPT_URL` with the project envelope `{ success, data?, error? }`. Extend its validator to **cap `partySize` at 4** and map field names to the sheet schema. Add a honeypot field + basic rate-limit awareness (`docs/05 §7`).
- States: idle → submitting (spinner, disabled, `aria-busy`) → success (petal-burst celebration, GUIDE 05) → error (inline message + gentle shake). Never leave the button in a dead state.

> ### 🔀 DECISION — RSVP transport
> Submit via `fetch("/api/rsvp", { method:"POST", … })` (server route keeps the Apps Script URL server-side — preferred, already built). Only post directly to Apps Script from the client if the route can't be deployed for some reason. Default to the server route.

**Google Apps Script (you set up the endpoint):** a Web App `doPost(e)` that appends a row to sheet **"RSVP"** `[timestamp, slug/nama_tamu, kehadiran, jumlah, catatan]` and returns JSON `{ success:true }`. Provide the user the script + deploy steps; they paste the deployment URL into `nikah-web/.env` as `APPS_SCRIPT_URL`. (You cannot create their Google account resources — give them a copy-paste script and a 4-step deploy checklist.)

### C.2 Wishes / Guestbook (`docs/02 §8`, `docs/05 §3`)
- Public message wall: read all wishes, render a feed (lazy-load / paginate — keep it light on cheap phones).
- Submit (nama + pesan) → appends to sheet **"Wishes"** `[timestamp, nama, pesan]` via the same Apps Script (add a `type` discriminator or a second route).
- New wish **prepends** with a slide-down + brief background highlight (FLIP detail in GUIDE 05); other cards shift smoothly.
- Optional soft moderation flag; default = show immediately with server-side rate limit + honeypot.

### C.3 Gift / "Tanda Kasih" (`docs/02 §8`, `docs/03 §8`, `docs/05 §4`)
- Grateful, non-transactional tone. **Indonesia & Japan banks shown equally**, plus physical gift address. All from `siteConfig.bank` (fill the real values — currently `"TBD"`).
- "Salin" copy buttons → toast "Tersalin ✓" (GUIDE 05). 
- **FAQ accordion** (`docs/03 §9`): grid-rows `0fr→1fr` reveal (not max-height hack), content fades in, chevron rotates 0→180°. Questions: bawa anak/pasangan, parkir, dress code, livestream, cara kirim tanda kasih.

### C.4 Closing — emotional symmetry (`docs/02 §9`, `docs/03 §10`, `docs/10 §12`)
The book closes by returning to the hero's world.
- **fal video reactivates:** a compact echo of the hero — `video/couple-idle.mp4` + a couple of `video/cat-*-idle.mp4` (or the cats-group loop) via `VideoLayer`, a ~0.8s mini-assemble.
- Copy: "Dengan penuh kebahagiaan, kami menanti kehadiranmu. / **Tak sabar bertemu denganmu di hari bahagia kami.** 🤍 / **Bashara & Hanifah** / #BASHicallyHANI's".
- **Cat peek** (`florals/cat-peek.png`): CSS `@keyframes` slide-in from the bottom edge, peek↔hide loop every ~10s — the "goodbye" from the cats (CSS only, no fal video; `docs/12`).
- Idle: fal video breathing; GSAP doves fly *upward and away* (emotional close); petals fade out. Audio keeps looping; mute toggle always available.

---

## D. Tier summary (ambient + data)
| System | HIGH | MID | LOW | REDUCED |
| :-- | :-: | :-: | :-: | :-: |
| Particle petals | 14 | 6 | 0 | 0 |
| Ambient doves | on | 1, slow | off | off |
| CSS breathing illustrations | on | on | on | off |
| Drapery ripple / scroll line | on | on | line off | off |
| Closing fal video | on | on | poster | poster |
| Audio | on | on | on | on (motionless toggle) |
| RSVP / Wishes / Gift forms | full | full | full | full (instant, no celebratory motion) |

Forms and data are **always fully usable**, on every tier, with motion disabled. Accessibility is non-negotiable (`PRODUCT.md`, `AGENTS.md` Priority 1).

---

## E. Acceptance criteria
- [ ] Petals fall and doves drift through every section below the hero; both pause off-screen / hidden tab.
- [ ] Japan section flips particles to sakura and back.
- [ ] La Vie en Rose starts on gate tap, loops, has a persistent breathing mute toggle persisted in `localStorage`.
- [ ] RSVP submits to Google Sheets through `/api/rsvp`, caps party size at 4, shows submitting/success/error states.
- [ ] Wishes wall reads + appends, new wish prepends with highlight.
- [ ] Gift shows ID + JP banks equally with working copy buttons + FAQ accordion.
- [ ] Closing echoes the hero (fal video returns) and the cat peeks goodbye.
- [ ] Everything fully usable with `prefers-reduced-motion` and on LOW tier.
- [ ] `type-check` + `lint` + `build` pass.

➡️ **Next:** [GUIDE 05 — Micro-Soul, Polish & Deploy](GUIDE-05-MICRO-SOUL-POLISH-DEPLOY.md) — the small delights, the QA, and launch.
