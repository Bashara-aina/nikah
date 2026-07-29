# 05 — Launch Risk Register & Generation Backlog
**Date:** 2026-07-05 · **Launch target:** guests need links ~2 weeks before 22 Aug → **hard deploy target: 8 August 2026** (send 10–14 Aug). That is ~34 days, not 48. Plan to it.

---

## 1. Blockers (ranked)

### P0 — prevents any build starting
1. **Working tree is torn down.** Git status shows the entire `nikah-web/` app (page, layout, hero components, motion providers, configs) and `tools/` deleted but uncommitted, and `docs/` — including the locked copy source `docs/03-copywriting.md` — absent. Nothing in this plan can be built or copy-bound until the repo reaches a deliberate state: either restore (`git checkout -- .` / restore docs from history) or commit the teardown and re-scaffold intentionally. **Owner: Bashara. Half a day. Do this first; every other line item assumes it.**
2. **Copy doc restored and confirmed locked.** If `docs/03-copywriting.md` cannot be recovered from git history, copy must be re-locked by the couple before L2 build — rule 5 forbids inventing it during build.

### P1 — prevents launch (not start)
3. **story-ch01 regeneration** (grey/off-world — doc 02 §9). Story can build around the slot meanwhile.
4. **gate-floral-border re-render ≥1080w** (375px source blurs on retina — doc 02 §2). Upscale fallback exists.
5. **Asset promotion pass executed** — 14 files moved to canonical paths, `meadow-bg` re-encoded ≤300KB, `story-ch01-meeting` 7.4MB original and all >1MB files re-encoded to web weight (target: every still ≤350KB at 1080w). Un-re-encoded promotions would fail the LCP law by themselves.
6. **RSVP backend live** (REF-03 Google Sheets path) — the one non-visual launch dependency.

### P2 — degrades launch, doesn't block
7. Guest-name link generation (fallback greeting exists — doc 01 Q3).
8. Music licensing sanity check on the La Vie en Rose recording (private-guest-list site lowers exposure; still worth a conscious yes).
9. Wishes moderation decision (doc 01 Q2).

## 2. Minimum additional generation (final)

| # | Asset | Why | Model | Est. cost |
|---|---|---|---|---|
| 1 | `story-ch01` regen (warm vignette per doc 02 brief) | Only off-world image in the promoted world | GPT Image 2 medium | $0.06 (×3 attempts budgeted: $0.18) |
| 2 | `gate-floral-border` re-render 1080×1920 | Resolution only | GPT Image 2 medium (or fal upscale of existing) | $0.06 (upscale ~$0.01) |
| 3 | *(stretch, gated by doc 03 fork 1)* `closing-echo-loop.mp4` | Emotional bookend | Kling v3 Pro i2v | ~$0.30 |

**Total mandatory: ≤$0.24. With stretch: ≤$0.54.** Target of ≤5 images / ≤1 video / ≤$5 is met with 10× headroom. Anything beyond this list is Phase 2 and requires a new decision doc, not an impulse generation.

## 3. Cost reference (per remaining asset)
GPT Image 2 medium $0.06 vs Seedream 5 Lite $0.035. **Stay on GPT Image 2 for both backlog images (Recommended):** the 14 promoted files establish a GPT-Image-2 "hand"; switching models to save $0.05 risks a texture mismatch that costs another regen anyway. Seedream is the fallback only if GPT Image 2 fails the ch01 brief twice. Upscales/knockouts on fal: ~$0.01 each, negligible.

## 4. Timeline (build order locked)

| Window | Work |
|---|---|
| **Jul 5–7** | P0: repo restored/committed to intentional state; copy doc recovered; couple answers the ≤12 open questions across docs 01–04 |
| **Jul 7–8** | Triage execution: promote 14 assets to canonical paths, re-encode weights, generate backlog items 1–2, run doc 04 eyeball checklist with couple |
| **Jul 8–15** | Build ACT 0 + world: L0 → L1 → L2 → L3 (the ritual + hero is half the site's total worth; it gets a full week) |
| **Jul 15–25** | Build L4 → L12 in scroll order; RSVP backend wired by Jul 22 |
| **Jul 25–29** | Tier passes (HIGH/MID/LOW/REDUCED), performance audit vs LCP/transfer law, a11y pass |
| **Jul 29–Aug 1** | Golden Gate C pre-flight (below) with the couple; ch01 in place; scrapbook go/no-go (photos in hand or cut confirmed) |
| **Aug 1–5** | Fix window + closing-loop stretch decision (only if GGC passed by Aug 1) |
| **Aug 6–8** | Deploy, real-device 3G test, link generation |
| **Aug 10–14** | Send to guests |

Slack: ~6 days total. If build overruns, the cut order is: closing loop stretch → petal drift → countdown band sway → L10 list animation. Never cut: L0 ritual, hero video path, tier fallbacks.

## 5. Golden Gate C pre-flight — 15-item manual checklist
Run on a real mid-range Android (Chrome, throttled 3G) + one iPhone, by Bashara, before deploy:
1. Cold load on 3G: envelope interactive <3s; hero poster paints <2.5s after gate.
2. Envelope tap → music fades in ≤1.2s; iOS gyro prompt appears once, inside the gesture.
3. Total hero-path transfer <800KB (DevTools network, disk cache off).
4. Lighthouse mobile ≥90 performance, ≥95 a11y.
5. Video loop seam invisible; poster→video crossfade shows no flash or layout shift.
6. Scroll L0→L12: sequence test (doc 04) — one book, no section "changes worlds."
7. No white `#FFFFFF` seams against ivory anywhere (check band/petal multiply edges).
8. Every text zone legible at 375px width in direct sunlight brightness (min contrast spot-check on L3 sky text and L5 digits).
9. All copy verbatim from restored `docs/03`; names, date (22-08-2026), venue, account numbers proofread by both of you.
10. Guest-name URL renders correctly incl. long names; fallback greeting renders when param absent.
11. RSVP submits to the sheet; duplicate submit handled; error state is human.
12. Wishes: submitted wish appears per the chosen moderation policy; emoji + long text don't break layout.
13. Reduced-motion (OS setting on): no animation anywhere, site fully usable, audio behavior per couple's answer to doc 03 Q3.
14. Low tier / Save-Data: poster hero, static everything, still beautiful — judge it as its own site, not a degraded one.
15. Kill-criteria sweep (below) on all 15 promoted assets in situ — any fail executes its doc 04 fallback before deploy, not after.

## 6. Kill criteria — regenerate vs CSS-substitute, decided in advance
**Regenerate** (max 2 attempts, then substitute) only when ALL true: the asset is a layer's PRIMARY visual; the failure is execution (grade/light/resolution), not concept; and the fix is promptable in one sentence. Current qualifiers: ch01, gate border. **Substitute with CSS/typography immediately** when: the asset is secondary/decorative; the failure is identity (faces/cats off-model — regen rarely fixes identity, it re-rolls it); a third attempt would be needed; or it's after Aug 1 (past that date, generation is frozen and only fallbacks execute). **Never** ship an off-model image because "we paid for it" — sunk-cost images are how one-world sites die; hero-tall-portrait stays dead as the standing example.

## Decisions locked
- Hard deploy target 8 Aug; guest send 10–14 Aug; generation freeze 1 Aug.
- P0 repo restore + copy recovery precedes all build work.
- Generation budget frozen at 2 images (+1 stretch video); model stays GPT Image 2 for stills.
- Build order: ritual+hero week first, then scroll order; cut order defined; tier fallbacks uncuttable.
- GGC pre-flight is the launch authority — 15/15 or the fix window absorbs it.

## Open questions for Bashara & Hanifah
1. Confirm the send date (10–14 Aug?) — Indonesian invitation etiquette may want earlier; the whole timeline keys off this.
2. Who tests on which real devices for the pre-flight? (Need at least one mid-range Android and one iPhone — not both of yours being flagships.)
3. La Vie en Rose recording: proceed as-is for a private guest site, or swap to a licensed/covered version you already own?

## If wrong, what breaks
If the P0 repo situation is deeper than it looks (docs unrecoverable from history), the copy re-lock adds ~3 days and consumes half the slack — survivable if started now, fatal if discovered in August. If the timeline is optimistic on build velocity, the cut order sheds polish while the 13-layer arc ships intact. The unhedged risk is the single-video hero on real Indonesian 3G: if item 1/3 of the pre-flight fails on real networks, LOW tier becomes the default experience for many guests — which is why item 14 demands the poster experience be judged as beautiful in its own right, not as a consolation prize.
