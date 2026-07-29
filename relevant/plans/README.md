# Nikah Ultimate Plans — Current State (2026-07-18)

**Entry point** for launch planning after the 10-agent deep asset triage that produced `relevant/`.

These five documents **supersede** the July 5 Phase 1 set (`10-docs/stitch/phase1/01–05`) and reframe the execution GUIDEs (`GUIDE-01…05`) for a world where assets mostly **already exist**. They do **not** overwrite anything under `10-docs/` — treat `10-docs/` as historical + design canon; treat `plans/` as the **actionable current-state** set.

---

## Where we are now (one page)

| Fact | Status |
|------|--------|
| Master visual | `relevant/01-hero-scenes-video/hero-main.webp` — style/palette/character law |
| Hero video | `hero-bg-loop.mp4` + poster — **shipping-ready, tiny (~244 KB)** |
| Illustrated world | ~47 KEEP visuals across `relevant/01`–`08` |
| Audio | Ship `relevant/09-references-audio/audio/la-vie-en-rose.mp3` only |
| **Only content gap** | `story-ch04-ldr-tokyo.webp` — **regenerate** (Tokyo Tower + sakura + split scene) |
| Main ship risk | **File weight**, not missing art — two ~7.4 MB blockers + many 1.8–3 MB stills |
| Dead world | `correct/`, `correct/most correct/`, TODO_ASSETS pending rows, Gemini/MiniMax pipelines — **do not plan against these** |
| Emotional arc | Intact: ritual → living hero → story → Japan → practical → closing |
| Design law | Storybook watercolor · ivory `#FBF7F0` · *hidup bukan kaku* · no envelope-as-asset excess · no gold filigree excess |

**Bottleneck inverted:** old GUIDEs assumed “generate everything then UI.” Reality: **promote + compress + one regen + build UI.**

---

## Reading order

| # | File | Role | Read when |
|---|------|------|-----------|
| 1 | [`01-SCOPE-AND-CURRENT-STATE.md`](./01-SCOPE-AND-CURRENT-STATE.md) | What ships, what doesn’t, DoD, golden gates | First — lock scope |
| 2 | [`02-ASSET-READINESS-AND-REMEDIATION.md`](./02-ASSET-READINESS-AND-REMEDIATION.md) | Ordered backlog: regen, rename, sharp, crop, promote map | Before any import into `nikah-web` |
| 3 | [`03-HERO-AND-GATE-LIVING-EXPERIENCE.md`](./03-HERO-AND-GATE-LIVING-EXPERIENCE.md) | L0–L3 assembly, motion ownership, tiers | Before building opening ritual |
| 4 | [`04-SCROLL-STORY-AND-SECTIONS.md`](./04-SCROLL-STORY-AND-SECTIONS.md) | L4–L12: story, scrapbook, Japan, event, RSVP arc, closing | After hero gate works |
| 5 | [`05-POLISH-DATA-AUDIO-DEPLOY.md`](./05-POLISH-DATA-AUDIO-DEPLOY.md) | Audio, Sheets, a11y, QA, Vercel, launch checklist | Final mile |

Cross-links inside each plan assume this order.

---

## Which “5 plans” we chose — and why

**Chosen hierarchy: `stitch/phase1/01–05` (launch / scope ultimate plans).**

| Candidate | Verdict |
|-----------|---------|
| `stitch/phase1/01`–`05` | **Selected.** Dated 2026-07-05; answer “what ships with assets we have”; golden gates; generation backlog; launch risk. Closest to “ultimate launch plans.” |
| `GUIDE-01`–`05` | **Reframed into plans 02–05 content**, not recreated as filenames. GUIDEs remain valid for *how to build components*, but GUIDE-01’s “Phase A generate everything first” gate is obsolete post-triage. |
| `GUIDE-00-EXECUTE.md` | Kickoff prompt that pointed at the 5 GUIDEs — still useful for emotional intent; superseded operationally by this README + plan 01. |

`CURSOR-MASTER-BRIEF.md` / `stitch/masterplan.md` remain design canon for arc, layers, and “master wins.” Where they conflict with triage (e.g. closing primary, scrapbook, ch04 vs ch01), **these plans win.**

---

## What each plan supersedes

| New plan | Supersedes (as *actionable* plan) | Still cite for |
|----------|-----------------------------------|----------------|
| 01 | `phase1/01-PHASE-1-SCOPE-LOCK.md`, parts of `GUIDE-00` | PRODUCT.md, masterplan emotional arc |
| 02 | `phase1/02-GENERATED-ASSET-TRIAGE.md`, `GUIDE-01` backlog, `TODO_ASSETS.md` (SKIP) | stitch/09 inventory naming, stitch/10 screen briefs for regen |
| 03 | `phase1/03-STATIC-VIDEO-MOTION-MAP.md`, `GUIDE-02` | stitch/07 motion, 09-hero-choreography |
| 04 | `phase1/04-VISUAL-COHERENCE-AND-LAYER-BINDING.md`, `GUIDE-03` | stitch/03 flow, stitch/10 screens 3–11 |
| 05 | `phase1/05-LAUNCH-RISK-AND-GENERATION-BACKLOG.md`, `GUIDE-04` + `GUIDE-05` | REF-03/04/05, PRODUCT a11y |

---

## Top deltas vs old Phase 1 / GUIDE plans

1. **Only mandatory regen is ch04** (Tokyo LDR) — not ch01. ch01 is KEEP + compress.
2. **Closing primary is `closing-couple-and-cats.webp`** — `closing-echo.webp` is secondary (groom black ≠ navy).
3. **Scrapbook is IN** with 4 kept photos — was CUT when zero photos existed.
4. **Asset surface is rich** (cats, cutout, florals, drapery, event arch, gift icon, accents) — old plan deferred most of this to Phase 2 / CSS substitutes.
5. **Compression + promote** replace “Phase 0 rmbg from `correct/`” and mass fal generation as the critical path.

---

## Owners (default)

| Role | Owns |
|------|------|
| **Cursor agent** | Compress/rename/crop scripts, promote into assets tree, UI build per plans 03–05, type-check/lint |
| **Human review** | ch04 regen approval, face/cat identity sign-off, copy proofread, golden-gate eyeball, device QA, bank/gift secrets |

---

## Related paths

- Master triage map: [`../INDEX.md`](../INDEX.md)
- Per-slice manifests: `../0*/manifest.md`, `../10-docs/manifest.md`
- Design / copy / stack canon (read-only for these plans): [`../10-docs/`](../10-docs/)
- Build deltas (Fable session): [`DELTA.md`](./DELTA.md)
- Human checklist: [`HUMAN-HANDOFF.md`](./HUMAN-HANDOFF.md)
- Live app: `../../nikah-web/` (`npm run dev`)
- Fable brief: [`../FABLE-5-ULTIMATE-BUILD-PROMPT.md`](../FABLE-5-ULTIMATE-BUILD-PROMPT.md)
