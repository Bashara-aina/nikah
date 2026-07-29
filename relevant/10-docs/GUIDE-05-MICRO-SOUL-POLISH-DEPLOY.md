# GUIDE 05 — MICRO-SOUL, POLISH & DEPLOY

> **Act 4 (The Soul).** The small things guests will tell people about — plus the QA, accessibility, performance, and launch that make it bulletproof on a cheap phone over mobile data.
> **Prerequisite:** [GUIDE 01–04](GUIDE-01-FAL-ASSET-ENGINE.md) complete. The site is functionally whole; this guide makes it *handcrafted*.

> ## ⭐ EVERYTHING ADJUSTS TO `nikah-web/scenes/hero-main.webp`
> Micro-interactions, toasts, bursts, and the cat-peek all use the master's palette and characters ([defined in GUIDE 01](GUIDE-01-FAL-ASSET-ENGINE.md#-the-master-visual-anchor--nikah-webscenes-hero-mainwebp)) — petal-burst colors are the master's wildflowers; the cat-peek is one of the master's cats. The final QA bar includes: **the hero is visually identical to `hero-main.webp`** (the poster *is* the master), and every section reads as the same world. If it doesn't match the master, it isn't done.

These micro-interactions need **no new assets** — pure JS + CSS + Motion/GSAP, all values from `lib/motionTokens.ts`. Build them as small reusable primitives in `components/interactions/`.

---

## PART A — THE MICRO-INTERACTION CATALOG

### A.1 Gate button "Buka Undangan"
- Idle: breathing scale 1→1.03 loop (already in `Gate.tsx` via `whileHover`/`whileTap` + spring). Add the idle breath.
- On tap: ripple from the tap point + brief scale pulse, then the gate transition fires. → `useRipple.ts`.

### A.2 RSVP pill select (Hadir / Tidak / Diusahakan)
- Unselected: neutral blush border. On select: morph — scale 1→1.04→1 + color floods from center (clip-path circle expand) + a checkmark draws in via SVG `stroke-dashoffset`. Ease `settle`, `dur.base`. → `PillSelect.tsx`.

### A.3 Form inputs (float label)
- Underline-style, no box. On focus: underline grows from center (`scaleX 0→1`, origin center, ~200ms); label floats up + shrinks. Error: label → dusty rose, underline → warning, gentle shake (`translateX ±3px ×3`, 200ms). Keep ≥44px hit height. → `FloatLabelInput.tsx`.

### A.4 RSVP submit → celebration
- Submitting: a small botanical wreath SVG rotates (spinner).
- Success: wreath morphs to a checkmark + **petal burst** — 6–8 tiny colored divs scatter outward with opacity fade (pure CSS, GPU transforms). → `SubmitButton.tsx` + `petal-burst.css`.
- Error: shake + error message slides in below.

### A.5 Copy buttons (bank account)
- Tap: button scales 0.96→1 (`settle`); a toast rises from the bottom "Tersalin ✓" with a small cat-paw SVG; auto-dismiss after 2s (fade + slide down). → `CopyButton.tsx` + `Toast.tsx` (queue, max 3 visible, auto-dismiss).

### A.6 FAQ accordion
- Open: `grid-template-rows: 0fr → 1fr` reveal (no max-height hack); content fades in; chevron rotates 0→180° (`ease.soft`). → `AccordionItem.tsx`.

### A.7 Wish prepend (FLIP)
- New wish card slides in from top (y −40→0) + opacity + brief cream→ivory highlight; existing cards shift down smoothly via FLIP (GSAP Flip or `motion` layout). → `WishCard.tsx`.

### A.8 Sticky RSVP + scroll-to-top
- Sticky RSVP button appears after the hero (IntersectionObserver on hero bottom), fade+scale `settle`, subtle breathing (1→1.02, 4s) — "wants" to be tapped; hides when the RSVP section is in view. Scroll-to-top appears after scrolling, smooth. → `StickyRSVP.tsx`, `ScrollTop.tsx`.

### A.9 Cat peek (Closing)
- `florals/cat-peek.png` slides up from the bottom edge on enter (`settle`), then peek↔hide loop every ~8–10s (CSS `@keyframes`). The cats' goodbye. → `CatPeek.tsx` (CSS-driven; built in GUIDE 04 C.4, refined here).

### A.10 Scroll hint (hero)
- After ~3s of no scroll, a chevron-down fades in, breathing gently; on any scroll it fades out immediately; never blocks content. → `ScrollHint.tsx`.

### A.11 Music-note easter egg
- At the Japan chapter, once per session, a single music note floats up from the audio toggle and fades (1.5s CSS). Subtle — most won't notice; that's the point. → `MusicNote.tsx`.

### A.12 Gallery lift + lightbox
- Hover/tap lift (`scale 1.04` + deeper warm shadow); tap opens accessible lightbox (built in GUIDE 03 §6 — confirm focus trap, Esc, scrim close here).

**Rules for every interaction:** `transform`/`opacity` only; 150–300ms for micro, 700–1000ms for reveals; meaning over decoration (`AGENTS.md` Priority 7); each has a reduced-motion fallback (collapse to instant). No `:hover`-only primary actions (touch-first). Min 44×44px targets, 8px min gap.

---

## PART B — ACCESSIBILITY PASS (Priority 1, CRITICAL)

From `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`. WCAG 2.2 AA.
- [ ] Body text ≥ 4.5:1, large text ≥ 3:1 — verify `--ink` on `--paper` **and** on `--cream`, not against screenshots. (`--ink #4A4039` on `--paper #FBF7F0` ≈ 7.2:1 ✅.)
- [ ] Visible focus rings on every interactive element (`:focus-visible` in `globals.css`, 2px `--ink`).
- [ ] Alt text is voice, not filler: "Bashara and Hanifah under morning light, soft smiles" — decorative florals/scenes `alt=""`.
- [ ] `aria-label` on icon-only buttons (audio toggle, scroll-top, lightbox close).
- [ ] `prefers-reduced-motion` collapses **Motion to instant and GSAP timelines to no-op** (centralized — verify both libraries honor it; don't duplicate per component).
- [ ] Keyboard reachable + operable: gate button, RSVP, wishes, audio toggle, accordion, lightbox. Logical tab order, Esc closes overlays.
- [ ] Color is never the only signal: countdown, RSVP state, form errors carry text + icon too.
- [ ] Bahasa Indonesia copy reviewed for inclusive language; the Surah Yasin verse is the couple's explicit choice — don't editorialize.
- [ ] No client-side PII beyond the `?to=` URL value.

Use the installed **ui-ux-pro-max** skill before finalizing visual choices (don't guess):
```bash
cd nikah-web
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "wedding landing page" --category style
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "soft blush cream" --category color
```

---

## PART C — PERFORMANCE PASS (Priority 3, HIGH)

Targets (`docs/06`, `docs/11 §9`, `AGENTS.md`): **Lighthouse mobile ≥ 90; hero LCP < 2.5s on 3G; hero transfer < 800 KB; JS bundle < 150 KB gz.**
- [ ] Every fal video < 2 MB, ≤ 1080px, H.264 `+faststart`, `preload="none"` except `hero-bg-loop.mp4` + `couple-idle.mp4`. WebP posters on all.
- [ ] All `<video>` pause off-screen (`useVideoLayer`) and on hidden tab.
- [ ] `next/image` for raster, explicit width/height (zero CLS); gallery + below-fold lazy.
- [ ] Single global RAF for parallax + particles; max ~18 animated elements in-viewport at once.
- [ ] `content-visibility:auto` on below-fold sections.
- [ ] Fonts via `next/font` self-hosted (Cormorant Garamond + body sans), zero layout shift.
- [ ] GSAP `kill()/revert()` + Lenis `destroy()` on unmount — no leaks.
- [ ] `@fal-ai/client` is **not** in the client bundle (script-only). Confirm with `npm run build` output.

---

## PART D — TIER QA MATRIX (test all four)

Force each tier and walk the whole flow:
| Tier | How to force | Must verify |
| :-- | :-- | :-- |
| HIGH | modern phone / desktop | full experience, 60fps |
| MID | throttle CPU 4×, mid device | video on, no tilt, fewer particles, still smooth |
| LOW | DevTools "Slow 3G" / Save-Data | posters not video, no parallax, fully usable |
| REDUCED | OS reduce-motion on | instant reveals, no positional motion, audio toggle works |

The site must **never be blank, never broken** — graceful at every tier (`PRODUCT.md` principle 5, brief success criterion 8).

---

## PART E — DEPLOY & LAUNCH

### E.1 Environment (`nikah-web/.env` → Vercel project env)
| Var | Where used | Note |
| :-- | :-- | :-- |
| `NEXT_PUBLIC_SITE_URL` | metadata / OG | real domain |
| `APPS_SCRIPT_URL` | `app/api/rsvp/route.ts` (server) | Google Apps Script Web App URL |
| `FAL_KEY` | **scripts only** | do NOT add to Vercel runtime — assets are pre-generated and committed |

### E.2 Steps
1. `npm run copy-assets` — ensure `public/assets/**` mirrors final assets, then commit them (the site ships static media; fal is not called at runtime).
2. `npm run type-check && npm run lint && npm run build` — all green.
3. Push the `feature/*` branch, open a PR to `main` (Conventional Commits; never commit to `main` directly per `AGENTS.md`).
4. Deploy to **Vercel** (Next.js native). Set `NEXT_PUBLIC_SITE_URL` + `APPS_SCRIPT_URL` in the Vercel dashboard.
5. **Preview deploy test on a real low-end phone over mobile data** — this is the actual audience.
6. Add OG/Twitter meta + a share image so the WhatsApp link preview looks intentional (`docs/spec/07`).
7. Wire the **guest-link generator** (`docs/05 §1`): a small CSV→URL script producing `https://<domain>/?to=Nama+Tamu` (or `?g=slug`) rows ready to broadcast.

### E.3 Definition of Done (from `docs/06`)
- [ ] Phase 0 assets all present; no 404s.
- [ ] One-page mobile, all sections render.
- [ ] Gate reads guest name; music starts on tap.
- [ ] Countdown → 22 Aug 2026 10:00 WIB.
- [ ] RSVP saves to Google Sheets; Wishes public read + submit.
- [ ] Gift + copy buttons; Map, Save-to-Calendar, Livestream work.
- [ ] Videos pause off-screen; reduced-motion → posters.
- [ ] Lighthouse mobile passes (≥ 90).
- [ ] All four tiers verified.

---

## "GOOD" LOOKS LIKE (the standard to build to)
1. Guest opens the link on their phone → sees the storybook gate, feels the ritual, hears music, is greeted by name.
2. The hero loads → a living painting; every element breathes at its own rate; tilting shifts the diorama.
3. They scroll → the 6-chapter love story unfolds; doves thread the chapters; the scrapbook feels tactile.
4. Below the hero → still alive: petals fall, florals sway, music plays. The world didn't stop.
5. RSVP → every interaction feels considered; the form is a pleasure.
6. Submit → the petal burst makes them smile.
7. The bottom → a cat peeks up to say goodbye.
8. On a slow connection / old phone → graceful, never broken, always beautiful.

**That is the standard. Build to it.**

---

### Guide map
- [GUIDE 01 — fal.ai Asset Engine](GUIDE-01-FAL-ASSET-ENGINE.md) — generate everything (run first).
- [GUIDE 02 — Gate & Hero](GUIDE-02-GATE-AND-HERO.md) — the ritual + the living world.
- [GUIDE 03 — Scroll Story & Sections](GUIDE-03-SCROLL-STORY-SECTIONS.md) — the narrative.
- [GUIDE 04 — Ambient, Audio & Data](GUIDE-04-AMBIENT-AUDIO-DATA.md) — keep it alive + RSVP/Wishes/Gift/Closing.
- **GUIDE 05 — Micro-Soul, Polish & Deploy** (this file) — the delights + launch.

**Canonical references (do not contradict):** `docs/01–13`, `docs/spec/*`, `nikah-web/AGENTS.md`. Where a guide and a doc conflict on a specific section's choreography, the more specific `docs/10 §N` wins; for the fal pipeline, GUIDE 01 + `docs/13` win.
