# REF 05 — VERIFICATION & LAUNCH PLAYBOOK

> How Cursor proves the site actually works and looks like the master before declaring done — then ships it. Self-verify; never ask the user to check manually what you can verify yourself.

---

## 0. The golden gate
**The hero must be visually identical to `nikah-web/scenes/hero-main.webp`** (the poster *is* the master), and every section must read as that same world. This is the top acceptance criterion. Screenshot the hero, put it next to `hero-main.webp`, and confirm.

## 1. Run & inspect locally
```bash
cd nikah-web
npm run copy-assets && npm run dev      # predev mirrors assets/ → public/assets/
```
- Verify the dev server boots and the **Network panel shows zero 404s** for any `/assets/**`.
- Use the **preview tooling** to drive and screenshot the running app (don't ask the user to look): start the server, reload, read console/network/logs, snapshot the DOM, screenshot visual changes, test clicks/fills. A Claude Preview launch config named **"nikah"** exists; the playwright MCP is also available. Prefer text-based checks (console, snapshot, network) first, screenshots to prove visuals.
- Walk the whole flow: Loading → Gate (tap) → audio starts + hero assembles → scroll the full story → RSVP submit → Closing cat-peek.

## 2. Four-tier QA matrix (force each, walk the flow)
| Tier | Force it | Must hold |
| :-- | :-- | :-- |
| HIGH | normal | full living experience, ~60fps, hero matches master |
| MID | DevTools CPU 4× throttle | video on, no tilt, fewer particles, still smooth |
| LOW | DevTools "Slow 3G" / Save-Data | posters not video, no parallax, fully usable, no jank |
| REDUCED | OS reduce-motion ON | instant reveals, zero positional motion, audio toggle works, content all present |
The site is **never blank, never broken** at any tier (`PRODUCT.md` principle 5).

## 3. Accessibility pass (WCAG 2.2 AA — CRITICAL)
- [ ] Body text ≥ 4.5:1 on `--paper` **and** `--cream`; large ≥ 3:1 (verify the real backgrounds, not screenshots).
- [ ] Visible `:focus-visible` ring on every interactive element; logical tab order; Esc closes gate/lightbox/overlays.
- [ ] `aria-label` on icon-only buttons (audio, scroll-top, lightbox close); alt text is voice; decorative imagery `alt=""`.
- [ ] Keyboard-operate the full RSVP + wishes forms; errors announced inline (text + icon, not color alone).
- [ ] `prefers-reduced-motion` collapses Motion to instant + GSAP to no-op (centralized — confirm, don't duplicate).
- [ ] Touch targets ≥ 44×44, ≥ 8px apart.

## 4. Performance pass (HIGH)
Targets: **Lighthouse mobile ≥ 90; hero LCP < 2.5s on 3G; hero transfer < 800 KB; JS bundle < 150 KB gz.**
- [ ] Every fal video < 2 MB, ≤ 1080px, H.264 `+faststart`; WebP poster on each; `preload="none"` except `hero-bg-loop.mp4`.
- [ ] All `<video>` pause off-screen (`useVideoLayer`) + on hidden tab.
- [ ] `next/image` with explicit width/height (zero CLS); gallery + below-fold lazy; `content-visibility:auto` below the fold.
- [ ] One global RAF for parallax + particles; ≤ ~18 animated elements in view at once.
- [ ] GSAP `kill()/revert()` + Lenis `destroy()` on unmount — no leaks. `@fal-ai/client` NOT in the client bundle (confirm in `npm run build` output).
- [ ] Run Lighthouse (mobile, throttled) and record the score.

## 5. Functional verification (Definition of Done — `docs/06`)
- [ ] Loading 1–2s → Gate; `sessionStorage` skip on refresh.
- [ ] Guest name from `?to=` renders; safe fallback when absent.
- [ ] Tap "Buka Undangan" → gyro prompt (iOS) → audio fades in → page-turn → hero assembles, no dead frame.
- [ ] Countdown ticks to 22 Aug 2026 10:00 WIB.
- [ ] RSVP saves to Google Sheet (`jumlah` capped 4); success/error states fire.
- [ ] Wishes public read + submit; new wish prepends.
- [ ] Gift shows ID + JP banks equally with working copy buttons; FAQ accordion opens.
- [ ] Map link, Save-to-Calendar (.ics + Google), livestream buttons work.
- [ ] Closing echoes the master (fal video returns); cat peeks goodbye.
- [ ] All four tiers verified; reduced-motion → posters.

## 6. Pre-merge gates
```bash
npm run type-check && npm run lint && npm run build
```
All green. Conventional Commits. Work on the existing `feature/*` branch; never commit to `main`. Don't edit `public/assets/` (edit `assets/` + `copy-assets`).

## 7. Deploy (Vercel)
1. Commit the generated `public/assets/**` (site ships static media; fal not called at runtime).
2. Push the branch, open a PR to `main`.
3. Deploy to Vercel. Set env: `NEXT_PUBLIC_SITE_URL`, `APPS_SCRIPT_URL`. **Do NOT** add `FAL_KEY` to Vercel runtime (script-only).
4. Add an OG/share image so the WhatsApp link preview looks intentional.
5. **Preview-deploy test on a real low-end phone over mobile data** — the actual audience. Verify hero LCP, audio-after-tap, RSVP write, reduced-motion.
6. Run `scripts/generate-guest-links.mjs` (REF 04) to produce the broadcast list.

## 8. Report back to the user after each phase gate
After Phase A (assets), after Hero, after sections+backend, and at launch: a short status with what's done, any 🔀 decisions you made, the Lighthouse score, a hero screenshot next to the master, and anything you still need (the REF 04 §5 values, `APPS_SCRIPT_URL`).

**The standard:** a guest opens the link on their phone, smiles within five seconds, feels the living storybook, RSVPs without friction, and remembers it — and it degrades gracefully on a cheap phone. If any of that isn't true, it isn't done.
