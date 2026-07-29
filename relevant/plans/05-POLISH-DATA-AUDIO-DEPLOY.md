# 05 — Polish, Data, Audio & Deploy

**Role:** Final mile — ambient soul, Sheets backend, a11y/perf, verification, Vercel  
**Date:** 2026-07-18 · **Suggest deploy target:** ~8–12 Aug 2026 (guest send ~10–14 Aug; wedding 22 Aug)  
**Supersedes:** `10-docs/stitch/phase1/05-LAUNCH-RISK-AND-GENERATION-BACKLOG.md` (risks/timeline); actionable parts of `GUIDE-04-AMBIENT-AUDIO-DATA.md` + `GUIDE-05-MICRO-SOUL-POLISH-DEPLOY.md`  
**Prerequisite:** [03](./03-HERO-AND-GATE-LIVING-EXPERIENCE.md) + [04](./04-SCROLL-STORY-AND-SECTIONS.md) functionally whole; [02](./02-ASSET-READINESS-AND-REMEDIATION.md) P0 done  
**Canon:** `REF-03` Sheets, `REF-04` config/copy, `REF-05` verification, `PRODUCT.md` a11y, `spec/03`/`08`

---

## 1. What “done” means now (assets mostly exist)

Launch is **not** blocked on a fal generation campaign. Done means:

1. Keepers promoted + compressed; **ch04 on-brief**; no 404s  
2. Full L0–L12 experience on real phones (HIGH and LOW both beautiful)  
3. La Vie en Rose unlocks on first tap and toggles cleanly  
4. RSVP + wishes write to live Google Sheets; gift info correct or graceful “menyusul”  
5. GG-Hero / GG-World / GG-Weight / GG-A11y / GG-Data all pass  
6. `type-check` + `lint` + `build` green; PR to `main`; Vercel env set  

Generation freeze after soft deadline: **no new art except ch04 retries** — only sharp/CSS fallbacks.

---

## 2. Audio — La Vie en Rose

| Item | Decision |
|------|----------|
| Ship file | `relevant/09-references-audio/audio/la-vie-en-rose.mp3` → `assets/audio/la-vie-en-rose.mp3` |
| Skip | SPOTISAVER stereo duplicate (~4.7 MB) |
| Spec | ~105.5 s, mono ~144 kbps, ~1.9 MB — enough for soft ambient loop |
| Unlock | First intentional tap (envelope or gate) — AudioContext requirement |
| Fade | 0 → ~30% over ~0.8–1.2s (GSAP / Motion via tokens) |
| Persist | `AudioManager` + localStorage mute preference; visible music toggle |
| Icons | After knockout/matched regen (plan 02 P1) — never opaque ivory tiles |
| Loop | Seamless or soft crossfade at end; duck optional after hero (plan 03 Q) |

**Owner:** Cursor agent implements; human confirms licensing comfort for private guest list (conscious yes).

---

## 3. Backend — Sheets / RSVP / Wishes

Align with `REF-03-BACKEND-GOOGLE-SHEETS.md` + `05-data-fields.md` + `spec/03-backend-api.md`.

### Cursor agent

- [ ] Extend `app/api/rsvp/route.ts` — Zod validate, pax cap, honeypot, rate limit, envelope `{ success, data?, error?, meta? }`  
- [ ] Create `app/api/wishes/route.ts` — GET feed + POST; same envelope; sanitize text  
- [ ] Never log PII/secrets; `APPS_SCRIPT_URL` server-only env  
- [ ] Graceful empty/error UI (no raw DB/Sheets errors to client)  

### Human

- [ ] Deploy Apps Script Web App; paste URL into Vercel/`nikah-web/.env`  
- [ ] Confirm sheet columns match `05-data-fields.md`  
- [ ] Decide wishes: **pre-moderated** vs **live** (changes L10 UX)  
- [ ] Provide once (REF-04 §5): bank ID+JP, gift address, livestream URLs, domain — until then render “menyusul” states  

### Guest links

- [ ] `scripts/generate-guest-links.mjs` — CSV → `?to=` URLs (REF-04)  
- [ ] Fallback greeting when param absent — launch-safe even if link gen slips  

---

## 4. Micro-soul catalog (GUIDE-05, scoped)

Build as `components/interactions/*` — transform/opacity only; reduced-motion = instant.

| ID | Interaction | Launch? |
|----|-------------|---------|
| A.1 | Gate ripple + breath | **IN** |
| A.2 | RSVP pill morph | **IN** |
| A.3 | Float-label inputs | **IN** |
| A.4 | Submit petal-burst | **IN** light (defer heavy confetti) |
| A.5 | Copy toast (bank) | **IN** |
| A.6 | FAQ accordion | **IN** |
| A.7 | Wish FLIP | **DEFER** — fade-in OK |
| A.8 | Sticky RSVP + scroll-top | **IN** |
| A.9 | Cat peek (Closing) | **IN** via `closing-hoshi-peek` |
| A.10 | Hero scroll hint | **IN** |
| A.11 | Japan music-note easter egg | Optional |
| A.12 | Gallery lift + lightbox | **IN** if scrapbook ships |

---

## 5. Accessibility & reduced motion

From PRODUCT / REF-05 / stitch/08:

- [ ] WCAG 2.2 AA — body ≥4.5:1 on actual backgrounds (esp. hero sky text, countdown digits)  
- [ ] `prefers-reduced-motion: reduce` → opacity-only / instant; **no** essential content gated on motion completion  
- [ ] Focus visible; skip/trap for lightbox; Esc closes  
- [ ] Touch targets ≥44×44, 8px gaps  
- [ ] Color never sole status signal (RSVP, errors)  
- [ ] Indonesian inclusive language — don’t invent religious framing beyond locked Yasin verse  

---

## 6. Performance law (post-compress)

| Budget | Target |
|--------|--------|
| Hero path transfer | <800 KB (video already ~244 KB) |
| LCP hero poster | <2.5s on throttled 3G |
| Per still (display) | ≤~350–400 KB; icons ≤80 KB |
| Lighthouse mobile perf | ≥90 |
| Lighthouse a11y | ≥95 |
| JS gz | aim <150 KB (don’t bloat for particles) |

Videos pause off-screen; posters always available; Save-Data → LOW tier.

---

## 7. Risk register (updated)

### P0 — blocks start / ship

| Risk | Mitigation | Owner |
|------|------------|-------|
| `nikah-web` / docs not in intentional state | Restore or re-scaffold from canon in `relevant/10-docs/` + prior git | Human + Cursor |
| ch04 still off-brief | Regen ≤2× then typographic fallback | Cursor + Human |
| Uncompressed 7 MB stills ship | Plan 02 sharp batch — **hard gate** before PR | Cursor |
| Sheets URL missing | Block RSVP send day; UI can soft-fail until wired | Human |

### P1 — degrades launch

| Risk | Mitigation |
|------|------------|
| Music icons ugly | Knockout / SVG fallback note icon |
| Scrapbook JPEGs too heavy | Ship story without strip |
| Guest links late | Fallback greeting |
| Closing primary still heavy | Compress; Ken Burns on still |

### P2 — polish

Ambient density, FLIP wishes, closing video stretch, shiro/hoshi re-cut.

**Cut order if late:** closing loop → sitewide particles → band sway → wish animation → scrapbook strip.  
**Never cut:** ritual unlock, hero video/poster path, tier fallbacks, RSVP submit, locked copy accuracy.

---

## 8. Timeline (realistic from 2026-07-18)

| Window | Work |
|--------|------|
| **Jul 18–20** | Plan 02 P0: ch04, rename, compress, promote, copy-assets |
| **Jul 20–27** | Plan 03: L0–L3 ritual + hero week |
| **Jul 27–Aug 5** | Plan 04: L4–L12 + Sheets wire |
| **Aug 5–8** | Plan 05: micro-soul, a11y/perf, GG pre-flight |
| **Aug 8–12** | Deploy + device QA + guest links |
| **Aug 10–14** | Send invitations |
| **Aug 22** | Wedding |

Slack is thin — execute compression **before** polish.

---

## 9. Golden Gate pre-flight (15 items)

Run on mid-range Android (Chrome, 3G throttle) + one iPhone — **Human** primary, Cursor assists:

1. Cold load: interactive ritual <3s; hero poster <2.5s after gate  
2. Tap → music ≤1.2s; iOS gyro once inside gesture  
3. Hero-path network <800 KB (disable cache)  
4. Lighthouse mobile ≥90 perf / ≥95 a11y  
5. Video loop seam + poster crossfade clean  
6. Scroll L0→L12: one world (GG-World)  
7. No `#FFFFFF` seams on ivory  
8. Text legible at 375px / bright screen  
9. Copy verbatim; date 22-08-2026; venue; accounts proofread by both  
10. `?to=` long names + missing-param fallback  
11. RSVP → sheet; duplicate/error human-readable  
12. Wishes per moderation policy; long text/emoji don’t break layout  
13. Reduced-motion fully usable  
14. LOW/Save-Data poster site judged as *beautiful*, not broken  
15. Kill-criteria: any off-model primary → fallback before deploy  

---

## 10. Deploy checklist (Vercel)

- [ ] Branch `feature/*` — never commit straight to `main`  
- [ ] Env: `APPS_SCRIPT_URL`, any public site URL/OG needs — **no** `FAL_KEY` required at runtime (generation is offline)  
- [ ] `npm run type-check && npm run lint && npm run build`  
- [ ] Confirm `prebuild` copy-assets includes audio + video + compressed stills  
- [ ] PR with Conventional Commits; preview URL device-tested  
- [ ] Production promote after GG pre-flight  
- [ ] Run guest-link generator; spot-check 3 links  

Ask before: `git push`, production promote, anything destructive.

---

## 11. Definition of Done — final checkbox rollup

**Assets**

- [ ] ch04 on-brief or conscious typographic fallback  
- [ ] `couple-cutout.png` spelling fixed  
- [ ] Compress list cleared; gift icon tiny  
- [ ] Music icons usable; floral-corner-br cropped  
- [ ] Only `la-vie-en-rose.mp3` shipped  

**Experience**

- [ ] L0–L12 + persistent UI  
- [ ] GG-Hero side-by-side pass  
- [ ] Four-tier QA matrix pass  

**Data**

- [ ] RSVP + wishes live  
- [ ] Config/copy locked; secrets only in env  

**Ship**

- [ ] Build green; Vercel prod; links sent  

---

## 12. Delta from old plan (`phase1/05` / GUIDEs)

| Old | Now |
|-----|-----|
| P0 = torn working tree + missing copy | Copy exists in `relevant/10-docs/`; repo may still need restore — still verify |
| Mandatory gen = ch01 + gate border | Mandatory gen = **ch04 only** |
| Closing stretch from `closing-echo` | Stretch from **primary** `closing-couple-and-cats` if at all |
| Generation budget framed as launch critical path | **Compression + UI** are critical path |
| TODO_ASSETS / fal Phase A gate | Obsolete — do not wait on them |
| Scrapbook Phase 1.5 only | Available now if weight allows |

---

## 13. Open questions (human)

1. Confirm guest **send window** (10–14 Aug?) — timeline keys off it  
2. Who owns pre-flight devices (need non-flagship Android)?  
3. Wishes moderation: live vs approve?  
4. La Vie en Rose: proceed as private-guest recording?  
5. Bank / gift / livestream values for REF-04 (or explicit “menyusul”)  

---

## 14. Handoff

| Goal | Ship Phase 1 invitation that matches `relevant/` reality |
|------|----------------------------------------------------------|
| What changed in planning | Assets-first triage; one regen; compress; scrapbook/closing/arch corrected |
| Open questions | §13 |
| Next owner | Cursor agent: execute 02→05 checklists; Human: answers + GG eyeball + Sheets deploy |

**Related:** [README](./README.md) · [01 Scope](./01-SCOPE-AND-CURRENT-STATE.md) · [02 Assets](./02-ASSET-READINESS-AND-REMEDIATION.md)
