# Agent 10 — Documentation Triage Manifest

**Slice:** all markdown + scratch files under `nikah-web/files/docs/` (plus flagged stray files).
**Verdict summary:** 66 KEEP · 7 SKIP (3 outdated docs + 4 scratch groups). Reference images (`stitch/*.jpg|png`, `ry0u7z_*.png`) and `.DS_Store` were out of scope for a docs slice and not copied.

**Canonical documentation:** this directory. The stale `nikah-web/files/docs/` mirror was removed.
**Canonical asset sources:** curated originals live in `relevant/01-…09-…`; production-ready app inputs live in `nikah-web/assets/`. The duplicate `nikah-web/content/` tree was removed.

Source root for the historical triage paths below was `/Users/basharaaina/Projects/nikah/nikah-web/files/docs/`.

| doc path | verdict | category | reason |
| :-- | :-- | :-- | :-- |
| 00-original-qa.md | KEEP | brief | Foundational concept Q&A (Perplexity export) that seeded 01-concept-brief; unique history/answers. Kept as origin material (per "when in doubt, keep"); superseded for daily use by the concept brief. |
| 01-concept-brief.md | KEEP | brief | Current concept brief — event date 22 Aug 2026, hashtag, theme. Authoritative. |
| 02-site-structure.md | KEEP | spec | Current site-structure/IA. Header "asset reality check" still cites `FOTO INVITATION/`+`correct/`, but structural content is current. Note: asset-source notes are stale, structure is not. |
| 03-copywriting.md | KEEP | spec | Locked section-by-section copy (Bahasa Indonesia). Authoritative content source. |
| 05-data-fields.md | KEEP | spec | Guest link / RSVP / wishes / gift / settings data model + Google Sheets backend. Authoritative. |
| 06-build-notes.md | KEEP | guide | Current stack + build notes; anchors to nikah-web/README. |
| 08-motion-principles.md | KEEP | spec | Motion foundation tokens/principles; references current fal.ai + GSAP two-layer architecture. |
| 09-hero-choreography.md | KEEP | spec | Hero choreography built on current fal.ai video loops + GSAP. |
| 10-section-choreography.md | KEEP | spec | Scroll storyboard per section; current motion architecture. |
| 11-build-architecture.md | KEEP | spec | Next.js + GSAP + Lenis + fal.ai technical blueprint. Current. |
| 12-asset-motion-map.md | KEEP | spec | Asset→motion map in current fal.ai/GSAP two-layer format. |
| 13-fal-generation-plan.md | KEEP | guide | Master fal.ai generation pipeline. Explicitly named authoritative; the current asset-generation source of truth. |
| CURSOR-MASTER-BRIEF.md | KEEP | brief | "Buka Buku" master brief — declared single source of truth for direction. |
| DESIGN.md | KEEP | brief | Pre-implementation design intent (aesthetic lane, storybook). Current seed. |
| GUIDE-00-EXECUTE.md | KEEP | guide | Kickoff execution prompt for the current build. |
| GUIDE-01-APPENDIX-MODEL-BUDGET.md | KEEP | guide | fal.ai model/budget sheet, companion to GUIDE-01. Current. |
| GUIDE-01-FAL-ASSET-ENGINE.md | KEEP | guide | The current asset engine; explicitly supersedes the MiniMax/Gemini workflow (see SKIP evidence below). |
| GUIDE-02-GATE-AND-HERO.md | KEEP | guide | Gate + living-world hero build guide. Current. |
| GUIDE-03-SCROLL-STORY-SECTIONS.md | KEEP | guide | Scroll story / sections build guide. Current. |
| GUIDE-04-AMBIENT-AUDIO-DATA.md | KEEP | guide | Ambient audio + data build guide. Current. |
| GUIDE-05-MICRO-SOUL-POLISH-DEPLOY.md | KEEP | guide | Micro-interactions, polish, deploy guide. Current. |
| NIKAH-MASTER-TECHSTACK.md | KEEP | brief | Techstack overview. NOTE: GUIDE-01 calls its MiniMax/Gemini generation instructions "old" and supersedes them; kept for the non-generation techstack knowledge (per "when in doubt, keep"). Treat generation-pipeline sections as superseded by GUIDE-01/13. |
| PRODUCT.md | KEEP | brief | Product brief. Authoritative. |
| REF-01-DESIGN-SYSTEM-AND-TOKENS.md | KEEP | spec | Design system + tokens reference. Current. |
| REF-02-BUILD-MANIFEST-FILE-TREE.md | KEEP | spec | Build manifest / file tree reference. Current. |
| REF-03-BACKEND-GOOGLE-SHEETS.md | KEEP | spec | Backend (Google Sheets) reference / API. Current. |
| REF-04-CONTENT-AND-CONFIG.md | KEEP | spec | Content + config reference. Current. |
| REF-05-VERIFICATION-AND-LAUNCH.md | KEEP | spec | Verification + launch reference. Current. |
| skills-lock.json | KEEP | config | Current skills lockfile (source + computed hashes). Live config, not scratch. Kept per explicit slice inclusion. |
| build/MASTER-PROMPT.md | KEEP | guide | Master Cursor prompt for the 7-stage build runbook. Current. |
| build/stage-1-foundation.md | KEEP | guide | Stage 1 of current 7-stage build runbook. |
| build/stage-2-motion-engine.md | KEEP | guide | Stage 2 build runbook. |
| build/stage-3-entry-hero.md | KEEP | guide | Stage 3 build runbook. |
| build/stage-4-narrative-sections.md | KEEP | guide | Stage 4 build runbook. |
| build/stage-5-functional-backend.md | KEEP | guide | Stage 5 build runbook. |
| build/stage-6-polish-butter-a11y.md | KEEP | guide | Stage 6 build runbook. |
| build/stage-7-qa-launch.md | KEEP | guide | Stage 7 QA/launch runbook. |
| spec/01-system-architecture.md | KEEP | spec | System architecture spec. Current. |
| spec/02-frontend-architecture.md | KEEP | spec | Frontend architecture spec. Current. |
| spec/03-backend-api.md | KEEP | spec | Backend API spec. Current (named authoritative category). |
| spec/04-data-model.md | KEEP | spec | Data model spec. Current (named authoritative category). |
| spec/05-user-flows.md | KEEP | spec | User flows spec. Current. |
| spec/06-motion-integration.md | KEEP | spec | Motion integration spec. Current. |
| spec/07-content-seo-share.md | KEEP | spec | Content/SEO/share spec. Current. |
| spec/08-build-test-deploy.md | KEEP | spec | Build/test/deploy spec. Current (named authoritative category). |
| spec/09-ui-design-system.md | KEEP | spec | UI design system spec. Current. |
| spec/10-interaction-microinteractions.md | KEEP | spec | Interaction / microinteractions spec. Current. |
| spec/11-smooth-scroll-performance.md | KEEP | spec | Smooth scroll / perf spec. Current. |
| spec/12-ux-wireframes-flow.md | KEEP | spec | UX wireframes / flow spec. Current. |
| spec/13-ux-quality-accessibility.md | KEEP | spec | UX quality / a11y / acceptance criteria spec. Current. |
| stitch/01-PROJECT-BRIEF.md | KEEP | brief | Stitch screen brief 01. Authoritative design-intent set. |
| stitch/02-VISUAL-LANGUAGE.md | KEEP | brief | Stitch screen brief 02 — visual language. |
| stitch/03-SECTIONS-AND-FLOW.md | KEEP | brief | Stitch screen brief 03 — IA/flow. |
| stitch/04-USER-JOURNEY-AND-GATE.md | KEEP | brief | Stitch screen brief 04 — journey/gate. |
| stitch/05-COPY-AND-TONE.md | KEEP | brief | Stitch screen brief 05 — locked copy/tone. |
| stitch/06-DESIGN-SYSTEM.md | KEEP | brief | Stitch screen brief 06 — design system. |
| stitch/07-MOTION-AND-CHOREOGRAPHY.md | KEEP | brief | Stitch screen brief 07 — motion. |
| stitch/08-MICROINTERACTIONS-AND-A11Y.md | KEEP | brief | Stitch screen brief 08 — microinteractions/a11y. |
| stitch/09-ASSET-INVENTORY.md | KEEP | brief | Stitch screen brief 09 — asset inventory (verified by reading files). |
| stitch/10-STITCH-PROMPTS-AND-SCREEN-BRIEFS.md | KEEP | brief | Stitch screen brief 10 — per-screen prompts. |
| stitch/masterplan.md | KEEP | spec | Living masterplan reconciling stitch/01–10 + GUIDE-01..05 + docs/01–13 + AGENTS.md. Top-level current source of truth. |
| stitch/phase1/01-PHASE-1-SCOPE-LOCK.md | KEEP | spec | Phase 1 scope lock (2026-07-05) — most recent planning. Current. |
| stitch/phase1/02-GENERATED-ASSET-TRIAGE.md | KEEP | spec | Phase 1 asset triage vs master hero (2026-07-05). Current. |
| stitch/phase1/03-STATIC-VIDEO-MOTION-MAP.md | KEEP | spec | Phase 1 static/video/motion law (one video at launch). Current. |
| stitch/phase1/04-VISUAL-COHERENCE-AND-LAYER-BINDING.md | KEEP | spec | Phase 1 layer-binding / one-world coherence. Current. |
| stitch/phase1/05-LAUNCH-RISK-AND-GENERATION-BACKLOG.md | KEEP | spec | Phase 1 launch risk register + generation backlog. Current. |
| 04-asset-list.md | SKIP | spec (outdated) | References dead source folders: `correct/` **and `correct/most correct/`** and `FOTO INVITATION/` as active asset sources (header table + §7 "Hard Rules"). Describes a MiniMax/Gemini+fal source workflow superseded by GUIDE-01/13. |
| 07-gemini-asset-prompts.md | SKIP | guide (superseded) | Explicitly superseded: GUIDE-01-FAL-ASSET-ENGINE.md states "This guide supersedes the MiniMax/Gemini instructions in the old NIKAH-MASTER-TECHSTACK.md and docs/07-gemini-asset-prompts.md. Everything generative now runs through fal.ai." Also sources from `FOTO INVITATION/` and its own header notes assets "sudah ada" (already generated). |
| TODO_ASSETS.md | SKIP | scratch (stale tracker) | Stale status checklist: every row still `⬜ pending` while `generated/` assets already exist, and it references dead sources e.g. `correct/most correct/cat-jiro-in-flowers.png`. Superseded by 13-fal-generation-plan.md. |
| ../../content/generated/please generate me the script, with japanese, hira.md | SKIP | scratch | Stray dropped prompt note — a UNIQLO SWOT/marketing presentation script (Japanese/hiragana/romaji), unrelated to this wedding project. |
| what is the best remove background github repo tha-2.md | SKIP | scratch | Raw ~279KB Perplexity research dump ("...best remove background github repo... better than removebg") recommending BiRefNet. Research chat export, not an authoritative project doc. |
| output.mp4 | SKIP | scratch | Early hero-video test render. |
| output-2.mp4 | SKIP | scratch | Early hero-video test render. |
| output-3.mp4 | SKIP | scratch | Early hero-video test render. |
| output-4.mp4 | SKIP | scratch | Early hero-video test render. |
