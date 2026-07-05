# AGENTS.md — rules for AI agents working on nikah-web

This file is authoritative for code in this subtree. Deeper `AGENTS.md` files win where present.

## Read first

Before writing any UI code in `nikah-web/`, read all of these in order:

1. `docs/01-concept-brief.md` — vision, palette, tone.
2. `docs/02-site-structure.md` — page sections + content order.
3. `docs/03-copywriting.md` — all copy is locked here; do not invent new copy.
4. `docs/06-build-notes.md` — build phases, performance budget.
5. `docs/08-motion-principles.md` — **motion tokens** are in `lib/motionTokens.ts`, the spec is here. No magic numbers.
6. `docs/09-hero-choreography.md` — Hero layer stack + assemble timeline.
7. `docs/10-section-choreography.md` — per-section entrance / idle / exit.
8. `docs/11-build-architecture.md` — folder layout, hooks, MotionProvider contract.
9. `docs/12-asset-motion-map.md` — which asset gets fal.ai video vs CSS vs GSAP.

## Project rules (locked)

- **Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4.
- **Animation libraries:** Motion (`motion/react`) + GSAP + Lenis. fal.ai videos are the source of truth for character ambient motion.
- **Animation ownership (do not duplicate):**
  - `Motion` (`motion/react`) — component-level enter/exit, springs, AnimatePresence for gate→hero swap, individual hero-character micro-entrance.
  - `GSAP` — ScrollTrigger parallax, MotionPath doves/butterflies, Hero master assemble timeline, particle canvas, gyro/tilt parallax.
  - `fal.ai` — character breathing / ear-twitch / tail-sway inside video loops. Never duplicate these with GSAP or Motion.
  - `CSS @keyframes` — small decorative florals, drapery ripple.
- **All motion values come from `lib/motionTokens.ts`.** No hardcoded easing/duration/amplitude strings in components. The adapter (`lib/motionAdapter.ts`) converts tokens into Motion + GSAP shapes.
- **Tier system is law.** Every animation consults `useMotion()` for `tier`. `REDUCED` → instant. `LOW` → poster fallback, no parallax. `HIGH | MID` → full motion budget per `tierBudget()`.
- **No `any`.** All function parameters and returns typed. Zod-style validation at API boundaries.
- **No swallowed errors.** Typed errors + correct HTTP status (200/201/400/401/403/404/409/422/500).
- **API responses use the project envelope:** `{ success, data?, error?, meta? }`.
- **No raw `<input>` / inline styles.** Use Tailwind utilities + shadcn-style patterns. Every interactive element ≥ 44×44 px hit target.
- **No placeholder text in shipped code.** Anti-slop rule. Section stubs say "coming soon" with a comment, not lorem ipsum.
- **Never edit `public/assets/`.** Edit `assets/` at the monorepo root and let `npm run copy-assets` mirror.
- **Conventional Commits:** `feat|fix|refactor|chore|docs|test|style: short description`.
- **Branch names:** `feature/*`, `fix/*`, `refactor/*`, `chore/*`. Never commit to `main`.
- **TypeScript gates before commit:** `npm run type-check` and `npm run lint` must pass.

## ui-ux-pro-max priorities (skills: `.cursor/skills/ui-ux-pro-max/`)

The `ui-ux-pro-max` skill is installed locally and supplies a searchable database of styles, palettes, font pairings, UX guidelines, and chart types. Before designing a new section, run its scripts to query the database; never guess.

Priority 1 — **Accessibility (CRITICAL):**
- Body text contrast ≥ 4.5:1; large text ≥ 3:1.
- Visible focus rings on every interactive element (`globals.css` already sets `:focus-visible`).
- Alt text on meaningful images, `aria-label` on icon-only buttons.
- `prefers-reduced-motion` already wired in `globals.css` and `MotionProvider`.
- `prefers-reduced-motion` MUST collapse Motion to instant and GSAP timelines to no-op. Both libraries honour this directly.

Priority 2 — **Touch & Interaction (CRITICAL):**
- Min touch target 44×44 px (iOS HIG) / 48×48 (Material).
- 8 px minimum gap between touch targets.
- Loading feedback on async actions (RSVP submit shows a spinner / disabled state).
- No reliance on hover alone for primary actions.

Priority 3 — **Performance (HIGH):**
- WebP/AVIF for images; `next/image` for raster; explicit `width` / `height` to prevent CLS.
- Videos: H.264 MP4, `preload="none"` except hero, pause off-screen via `useVideoLayer`.
- Single RAF for global parallax + particles.
- Target: Lighthouse mobile ≥ 90, hero LCP < 2.5 s on 3 G, hero transfer < 800 KB.

Priority 7 — **Animation (MEDIUM):**
- Duration 150–300 ms for micro-interactions, 700–1000 ms for reveals (see `motionTokens.ts`).
- Motion conveys meaning; decorative-only motion is banned.
- Never animate `width` / `height` / `top` / `left`. Use `transform` and `opacity`.
- Every animation has a reduced-motion alternative (handled centrally; do not duplicate).

## Discovering styles / palettes / typography

```bash
# Styles — query the database for a UI type
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "wedding landing page" --category style

# Color palettes — search by mood
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "soft blush cream" --category color

# Font pairings — pick by contrast axis (serif + sans, geometric + humanist)
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "editorial serif + sans" --category typography
```

Already paired in this project: Cormorant Garamond (serif, display) + Inter (sans, body). Pair chosen for editorial wedding register; swap only via `app/layout.tsx`.

## Working with fal.ai

fal.ai is used in `scripts/generate-assets.mjs` (Phase 0 — not in this PR). When that ships, the videos land in `public/assets/video/*.mp4` and `VideoLayer` primitive consumes them. Do not bundle `@fal-ai/client` to the site — it stays a script-only dep.

## Smoke testing after edits

```bash
npm run type-check   # tsc --noEmit
npm run lint         # next lint
npm run build        # next build (catches RSC boundary mistakes)
npm run dev          # localhost:3000 — Gate → Hero sequence fires
```

No automated tests yet (per project rule `clean-code.mdc`). Adding a test runner is a separate chore.

## Don't drift

If a doc contradicts this file, prefer the doc with the more specific scope (e.g. `docs/10` §N for a specific section's choreography). When in doubt, ask.