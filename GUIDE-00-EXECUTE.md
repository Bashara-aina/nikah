# GUIDE 00 — EXECUTE EVERYTHING (paste this into Cursor)

> This is the single kickoff prompt. Read it, then read the 5 guides, then build the whole site end-to-end. Work autonomously — don't stop to ask unless something is destructive or truly ambiguous.

---

## THE PROMPT (copy everything below)

You are building **the wedding invitation website for Bashara & Hanifah** (akad 22 Aug 2026, Widuri Restaurant, Bandung) inside `nikah-web/`. It must be the most *alive*, beautiful, interactive storybook invitation — "hidup, bukan kaku." Mobile-portrait first.

**⭐ THE MASTER VISUAL ANCHOR is `nikah-web/scenes/hero-main.webp`. This image IS the design. Open it first. Everything — palette, light, characters, the seven cats, the hero, every section, every generated asset — conforms to it. When anything is ambiguous, match the master. The hero IS this image brought to life.**

### Read first (in order), then follow them exactly

**The 5 act-guides (the experience):**
1. `GUIDE-01-FAL-ASSET-ENGINE.md` (+ `GUIDE-01-APPENDIX-MODEL-BUDGET.md`) — configure fal.ai yourself and generate ALL assets within the $10 budget (run before any UI).
2. `GUIDE-02-GATE-AND-HERO.md` — the opening ritual + the living hero (animate the master).
3. `GUIDE-03-SCROLL-STORY-SECTIONS.md` — the love story + content sections.
4. `GUIDE-04-AMBIENT-AUDIO-DATA.md` — ambient life + audio + RSVP/Wishes/Gift/Closing.
5. `GUIDE-05-MICRO-SOUL-POLISH-DEPLOY.md` — micro-interactions + a11y/perf/QA + deploy.

**The 5 reference files (the how — read alongside the guides):**
- `REF-01-DESIGN-SYSTEM-AND-TOKENS.md` — palette/fonts/z-scale/shadows/shape language (read before any UI; foundation).
- `REF-02-BUILD-MANIFEST-FILE-TREE.md` — exact file tree, what exists vs to-create, `page.tsx` assembly order, RSC/client boundaries.
- `REF-03-BACKEND-GOOGLE-SHEETS.md` — copy-paste Apps Script + RSVP/Wishes routes + deploy steps.
- `REF-04-CONTENT-AND-CONFIG.md` — real `config.ts`/`copy.ts` values + guest-link generator + the one list of values to ask me for.
- `REF-05-VERIFICATION-AND-LAUNCH.md` — self-verify playbook, tier/a11y/perf QA, the "matches the master" gate, deploy.

Also obey, as canonical: `nikah-web/AGENTS.md`, `nikah-web/docs/01–13`, and `nikah-web/docs/spec/*`. Copy is **locked** in `docs/03-copywriting.md` — never invent text. All motion values come from `lib/motionTokens.ts` via `lib/motionAdapter.ts` — no magic numbers. Build on the existing scaffold (`Gate.tsx`, `heroLayout.ts`, `VideoLayer`/`useVideoLayer`, `MotionProvider`, `lib/{config,guest,tier}.ts`, `app/api/rsvp/route.ts`, `page.tsx` stubs) — extend, don't reinvent.

### How to work
- **You own the middle decisions.** Each guide has 🔀 DECISION boxes — pick the recommended default unless you have a clear reason, and record any model/path swap at the top of `docs/13-fal-generation-plan.md`.
- **Configure fal.ai yourself, on a $10 budget.** `FAL_KEY` is already in `nikah-web/.env`; `@fal-ai/client` is installed (script-only, never bundled to the site). Set a **$10 hard spend cap** in the fal dashboard and tell me you did. **Follow `GUIDE-01-APPENDIX-MODEL-BUDGET.md` for exactly which model to use per asset, the settings, and the spend order** — the whole pipeline is ~$3, so generate hero + illustration *variants* and keep the best. Verify each video model's live price with one test generation before batching. Generate assets with the phased, idempotent `scripts/generate-assets.mjs` (build it per GUIDE 01). Never call fal at site runtime — the site only loads finished MP4/WebP/PNG/MP3.
- **Respect motion ownership:** fal.ai video = character/scene breathing (never duplicated); Motion = enter/exit + gate→hero swap; GSAP = assemble timeline, scroll/tilt parallax, doves/butterflies, particles; CSS = small florals + dividers.
- **Tier system is law:** HIGH/MID/LOW/REDUCED via `useMotion()` + `tierBudget()`. Posters on every video. Reduced-motion → instant, no positional motion. Never blank, never broken.
- **Don't touch:** `public/assets/` (edit `assets/` + `npm run copy-assets`), real photos turned to video (forbidden — harmonize only ≤0.35), `main` branch (work on the existing `feature/*` branch), `correct/` files used directly (all pass through fal first).

### Execution order with hard gates
**PHASE A — Assets (GUIDE 01). Do this completely before any UI.**
1. Build `scripts/generate-manifest.json` (asset triage) + `scripts/generate-assets.mjs` + the `gen:*` npm scripts.
2. `npm install` → `npm run gen:dry` → run phases: `gen:0` (**REGENERATE** refs via img2img → then rmbg finish — never rmbg-alone) → `gen:0b` (**COMBINE** several refs into cohesive group assets, preferred) → `gen:1` (scene/floral video, incl. the hero loop **from `scenes/hero-main.webp`**) → `gen:2` (character idle, Path A only) → `gen:4` (gallery harmonize) → `gen:6` (story illustrations).
   **`correct/` is AI reference only — never shipped, never just background-removed; it must be regenerated into clean on-brand assets.**
3. ffmpeg-compress every video (<2 MB, ≤1080px, +faststart) + export a WebP poster for each.
4. `npm run copy-assets` → `npm run dev` → confirm **zero 404s**, update `docs/TODO_ASSETS.md` to ✅.
   🚦 **GATE: do not start UI until every manifest output exists, posters included, faces in gallery recognizable, story illustrations consistent, hero loop looks like the master.**

**PHASE B — Build the experience (GUIDES 02→05 + REF 01/02, in order).**
5a. First apply `REF-01` token additions (dusty/peach/z-scale/shadows) and follow `REF-02` file tree + `page.tsx` assembly order. Build `AmbientLayer` + `AudioManager` shell so every later section inherits ambient + audio.
5. Gate (+ loading screen, audio kickoff, gyro permission, page-turn) → Hero (the master, brought to life: cohesive `hero-bg-loop.mp4` full-bleed + doves/butterflies/petals/parallax/text).
6. Welcome → Countdown → 6-chapter Story → Japan → Event → Gallery.
7. AmbientLayer (petals/doves/breathing/drapery/scroll line) + AudioManager (persistent breathing mute toggle) → RSVP + Wishes + Gift + FAQ → Closing (master's world returns, cat peeks goodbye).
8. Micro-interactions (ripple, pill morph, float-label, submit petal-burst, copy toast, accordion, wish FLIP, sticky RSVP, cat-peek, scroll-hint, music-note).

**PHASE C — Polish, verify, ship (GUIDE 05 + REF 03/04/05).**
9. Fill `lib/config.ts` + create `lib/copy.ts` per `REF-04` (real venue/maps/calendar/etiquette from `docs/05`/`docs/03`, all copy transcribed). Ask me **once** for the `REF-04 §5` list (bank ID+JP, gift address, livestream URLs, domain, `APPS_SCRIPT_URL`); render graceful "menyusul" states until provided.
10. Wire the backend per `REF-03`: give me the copy-paste Apps Script + 5-step deploy checklist; build `app/api/wishes/route.ts` and extend `rsvp/route.ts` (cap pax, honeypot). I paste the Web App URL into `.env`.
11. Run the full `REF-05` verification: a11y (WCAG 2.2 AA), perf (Lighthouse mobile ≥90, hero LCP <2.5s/3G, hero <800 KB, JS <150 KB gz), the **four-tier QA matrix**, and the **golden gate — the hero is visually identical to `hero-main.webp`** (screenshot side-by-side).
12. `npm run type-check && npm run lint && npm run build` all green. Commit assets, push the `feature/*` branch, open a PR to `main` (Conventional Commits). Give me the Vercel env list + run the guest-link generator (`REF-04 §4`).

### Definition of done
Every box in each guide's acceptance criteria + GUIDE 05 "Definition of Done" is checked, the hero is visually identical to `hero-main.webp`, every section reads as that same world, and it degrades gracefully on a cheap phone over mobile data.

**Start now: open `scenes/hero-main.webp`, read GUIDE 01, build the manifest + generator, and run Phase A. Report after each phase gate.**

---

*(End of prompt. The 5 guides referenced above contain the full per-act detail.)*
