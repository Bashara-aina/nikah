# 01 — Current State and Target Architecture

**Status:** authoritative roadmap, written 2026-07-29 (D-24)
**Scope:** the whole `nikah-web` codebase, from where it stands today to the state it should be in when it is frozen on 2026-08-21.

---

## 0. How to read this set

Five documents, each owning one slice. Nothing is duplicated between them; where a topic
touches two files, the owner is named.

| File | Owns | Read it when |
|---|---|---|
| **01** (this) | Constraints, current inventory, target architecture, milestones, risk register, decision log | Starting any work, or deciding whether something belongs in scope |
| **02** | Supabase schema, migrations, API contracts, validation, rate limiting, backup/export | Touching `lib/guests.ts`, `lib/db.types.ts`, `app/api/**`, `supabase/**` |
| **03** | The two invitation variants, copy canon, motion, accessibility, performance | Touching `components/sections/**`, `lib/copy.ts`, `app/undangan/**`, `app/live/**` |
| **04** | Dashboard features and the actual operation of sending 200 invitations | Touching `app/dashboard/**`, `lib/waTemplates.ts`, or planning the send |
| **05** | Tests, CI, security review, deployment, launch checklist, D-day runbook, post-event | Before every deploy, and on 22 August |

**Priority legend used throughout:**

- **P0** — launch is impossible without it.
- **P1** — must land before invitations go out, or the first guests get a worse experience than the last.
- **P2** — should land before the freeze on 21 August.
- **P3** — genuinely optional; do it only if P0–P2 are done and there is calm time left.

**Status legend:** `DONE` · `IN PROGRESS` · `TODO` · `BLOCKED` · `DECIDED — NOT DOING`

---

## 1. Hard constraints

These are facts, not preferences. Every plan below bends around them.

### 1.1 The calendar

| Date | Day | D-… | What it is |
|---|---|---|---|
| 2026-07-29 | Wed | D-24 | Today. Guest system merged, backend not yet wired. |
| 2026-08-15 | Sat | D-7 | **RSVP deadline printed in the invitation** (`siteConfig.rsvp.deadline`). |
| 2026-08-21 | Fri | D-1 | Code freeze. Nothing ships after this except a content value or a rollback. |
| 2026-08-22 | Sat | D-0 | Akad 10.00 WIB, Widuri Restaurant Lantai 2, Bandung. Resepsi until 13.00 WIB. |

The deadline that actually governs engineering is **not** 22 August. It is the day
invitations start going out, because after that the URL scheme, the slug format, and the
copy inside a sent message can no longer change without breaking links people already hold.
Target that date: **2026-08-03 (D-19)** for the pilot, **2026-08-04 → 08-08** for the bulk.

Everything that changes a guest-visible URL or a message body is therefore P0/P1 and must
land before 3 August. Everything else can move.

### 1.2 The audience

- ~200 invitations, three groups: `groom_family`, `bride_family`, `friend`.
- Two invitation types: `venue` (Bandung) and `online` (livestream only).
- Predominantly Indonesian, on mid-range Android over 4G, opening a WhatsApp link.
- A meaningful minority are in Japan (Tokyo/Yokohama) — different timezone, better network.
- Older relatives will open this. Tap targets, contrast, and font size are not cosmetic.

### 1.3 The technical envelope

- Next.js 16.2.12 App Router · React 19.2.7 · TypeScript 5.7 strict · Tailwind v4.3.1.
- Motion 12 + GSAP 3.13 + Lenis 1.3.23, governed by `lib/motionTokens.ts` and the tier system.
- Supabase Postgres (project `xwqlmdtxzcfygnvoowhx`, Southeast Asia).
- Vercel hosting, domain `ourwedding.hanifahbashara.com` (**not yet purchased** — see §6 risks).
- No test runner, no CI, as of today.

---

## 2. Current state — an honest inventory

### 2.1 Routes

| Route | Rendering | State | Notes |
|---|---|---|---|
| `/` | Static | `DONE` | Online variant, generic greeting. The forwardable URL; carries no venue. |
| `/undangan/[slug]` | `force-dynamic` | `DONE` | Resolves the guest, tracks the open via `after()`, falls back to the public invitation on unknown slug. |
| `/live` | Static | `DONE` | Stable livestream landing. Channel pills render inert until `siteConfig.livestream` is filled. |
| `/dashboard` | `force-dynamic` | `DONE` | Passphrase gate → guest list. Renders a "belum tersambung" notice while Supabase env vars are missing. |
| `/api/rsvp` | Node | `DONE` | POST only. Writes to `rsvps`, links `guest_id` by slug. |
| `/api/wishes` | Node | `DONE` | GET wall (limit 200) + POST. |
| `/api/dashboard/session` | Node | `DONE` | POST login, DELETE logout. |
| `/api/dashboard/guests` | Node | `DONE` | GET list, POST create. |
| `/api/dashboard/guests/[id]` | Node | `DONE` | PATCH (full edit or `{invited}` only), DELETE. |

### 2.2 Library modules and their boundaries

| Module | Client-safe? | Purpose |
|---|---|---|
| `lib/config.ts` | ✅ | Locked event facts, `calendarUrl({online})`. |
| `lib/copy.ts` | ✅ | Every guest-facing string. |
| `lib/motionTokens.ts`, `lib/motionAdapter.ts`, `lib/tier.ts` | ✅ | Motion law. |
| `lib/useCountdown.ts` | ✅ | Countdown hook. |
| `lib/invitation.ts` | ✅ | `InvitationGuest` — the narrow guest shape the browser is allowed to see. |
| `lib/slug.ts` | ✅ | `slugify`, `isValidSlug`. Split out of `guests.ts` precisely so the dashboard can import it. |
| `lib/phone.ts` | ✅ | E.164 normalisation, display formatting, `wa.me` link builder. |
| `lib/waTemplates.ts` | ✅ | Six templates + `renderMessage`. |
| `lib/db.types.ts` | ✅ (types + small consts) | Hand-written schema mirror. |
| `lib/rateLimit.ts` | ❌ server | In-memory per-IP limiter. |
| `lib/auth.ts` | ❌ server | HMAC session cookie, `node:crypto`. |
| `lib/supabaseAdmin.ts` | ❌ server | Secret-key client. **Never import from a `"use client"` file.** |
| `lib/guests.ts` | ❌ server | All guest queries + `validateGuestInput`. |
| `lib/dashboardApi.ts` | ❌ server | Shared envelope responses. |

This split is the single most important architectural property of the codebase right now,
and §3.2 turns it into an enforced rule rather than a convention.

### 2.3 What is verified and what is not

**Verified in a production build (2026-07-29):** unknown slug → generic gate; online variant
renders `Watch` + online RSVP + online FAQ + online closing; party-size selector correctly
absent for online guests; dashboard login accepted the passphrase and the session persisted;
`type-check`, `lint`, `build` all pass.

**Not yet exercised at all** (blocked on `SUPABASE_SECRET_KEY`): guest create/edit/delete,
`wa.me` link generation from real rows, open tracking, RSVP writes, wishes writes and the
wall read, the `guest_id` linkage, and every error path that requires the database to answer.

Nothing in this roadmap should be treated as working until it has run against the real
database. See 05 §2 for the smoke script that closes this gap.

### 2.4 Known debt carried into today

| # | Debt | Severity | Owner doc |
|---|---|---|---|
| D1 | `SUPABASE_SECRET_KEY` missing; nothing data-backed has ever run | **P0** | 02 |
| D2 | Domain not purchased; `NEXT_PUBLIC_SITE_URL` points at a host that does not resolve | **P0** | 05 |
| D3 | Open tracking counts WhatsApp/Facebook link-preview crawlers as guests | **P1** | 02 |
| D4 | `lib/rateLimit.ts` is per-instance memory; on Vercel it is close to decorative | **P1** | 02 |
| D5 | No tests, no CI; every regression is found by eye | **P1** | 05 |
| D6 | Adding 200 guests through a one-at-a-time form is hours of typing | **P1** | 04 |
| D7 | New online copy is not mirrored into the locked `03-copywriting.md` | **P1** | 03 |
| D8 | Gift section requested but not built (conflicts with an earlier locked decision) | **P2** | 03 |
| D9 | Doc sprawl: `nikah-web/files/docs/` duplicates `relevant/10-docs/`; `AGENTS.md` points at `docs/`, which does not exist | **P2** | 01 §4 |
| D10 | `nikah-web/content/` (65 tracked files) duplicates `assets/`; `.git` is 722 MB | **P2** | 01 §4 |
| D11 | `nikah-web/guests.example.csv` is orphaned — the script that consumed it was deleted | **P3** | 01 §4 |
| D12 | RSVP has no dedupe: a guest submitting twice creates two rows | **P2** | 02 |
| D13 | Wishes wall has no moderation or hide flag | **P2** | 02 |

---

## 3. Target architecture — what "ideal" means here

"Ideal" for this project is not maximal. It is **a codebase that a stressed person can safely
change at 23.00 on 20 August.** Every rule below serves that.

### 3.1 The layering

```
        ┌─────────────────────────────────────────────────────┐
 data   │  Supabase Postgres — guests · rsvps · wishes         │
        │  RLS on, zero policies. Reachable only by the        │
        │  secret key.                                         │
        └───────────────────────▲─────────────────────────────┘
                                │ supabase-js, secret key
        ┌───────────────────────┴─────────────────────────────┐
 server │  lib/supabaseAdmin · lib/guests · lib/auth           │
        │  lib/rateLimit · lib/dashboardApi                    │
        │  app/api/** · server components                      │
        └───────────────────────▲─────────────────────────────┘
                                │ narrow, serialisable props
        ┌───────────────────────┴─────────────────────────────┐
 shared │  lib/config · lib/copy · lib/invitation · lib/slug   │
        │  lib/phone · lib/waTemplates · lib/db.types          │
        │  lib/motionTokens · lib/motionAdapter · lib/tier     │
        └───────────────────────▲─────────────────────────────┘
                                │
        ┌───────────────────────┴─────────────────────────────┐
 client │  components/** · app/dashboard/*Client components    │
        │  Never imports a server module.                      │
        └─────────────────────────────────────────────────────┘
```

**The one-way rule:** client → shared → (nothing). Server → shared → (nothing). A client
module importing `lib/guests.ts` is a bug even if it type-checks, because it drags the
Supabase client and the secret key path into the browser bundle.

### 3.2 Rules to enforce (and how)

| Rule | Enforcement | Status |
|---|---|---|
| No client module imports a server module | `import "server-only"` at the top of the five server modules | `TODO` P1 — 05 §3 |
| No `any`; explicit return types on exported functions | `tsc --noEmit` + ESLint | `DONE` |
| API responses use `{ success, data?, error?, meta? }` | Reviewed by hand; add a shared response helper | Partly — `lib/dashboardApi.ts` covers the dashboard only |
| Guest-facing strings live only in `lib/copy.ts` | Review; a lint rule is overkill at this size | `DONE` |
| Motion values come from `lib/motionTokens.ts` | `AGENTS.md`; no magic numbers in components | `DONE` |
| The browser never receives a phone number | `InvitationGuest` in `lib/invitation.ts` is the only guest shape passed to `<Invitation>` | `DONE` — keep it that way |
| Every interactive element ≥ 44×44 px | Review pass in 03 §7 | Partly |

### 3.3 The ideal file tree at freeze

Additions marked `+`, removals `-`, everything else already exists.

```
nikah-web/
  app/
    api/
      dashboard/{session,guests,guests/[id]}/route.ts
    + api/health/route.ts                 # 05 §6 — one cheap liveness probe
      api/{rsvp,wishes}/route.ts
    dashboard/{page,LoginForm,GuestDashboard}.tsx
    + dashboard/QuickAdd.tsx              # 04 §4 — paste-many-guests
    live/page.tsx
    undangan/[slug]/page.tsx
    {layout,page,globals.css}
  components/
    sections/*.tsx                        # + Gift.tsx if D8 is approved
    ui/*.tsx
    {AudioProvider,GuestProvider,Invitation}.tsx
  lib/
    *.ts                                  # as inventoried in §2.2
    + tests/…  or  *.test.ts colocated    # 05 §2
  supabase/migrations/
    0001_guests.sql
    + 0002_tracking_and_dedupe.sql        # 02 §4
  + .github/workflows/ci.yml              # 05 §3
  + docs/ → symlink or move of relevant/10-docs   # resolves D9
  - guests.example.csv                    # D11
  - content/                              # D10 — move out of git history or stop tracking
```

### 3.4 Quality bar, stated as thresholds

| Dimension | Threshold | Where measured |
|---|---|---|
| Type safety | `tsc --noEmit` clean, zero `any`, zero `@ts-expect-error` | CI |
| Lint | `eslint .` clean | CI |
| Build | `next build` clean, no new route accidentally dynamic | CI |
| Unit tests | 100% of pure functions in `lib/{phone,slug,waTemplates,auth,guests-validation}` | 05 §2 |
| Smoke | One scripted pass over the guest lifecycle against a real Supabase project | 05 §2 |
| LCP (hero, mid Android, 4G) | < 2.5 s | 03 §8 |
| Invitation transfer, first screen | < 800 KB | 03 §8 |
| Contrast | Body ≥ 4.5:1, large ≥ 3:1 | 03 §7 |
| Tap targets | ≥ 44×44 px, ≥ 8 px apart | 03 §7 |
| Reduced motion | Every animation has an instant path | 03 §6 |
| Secret exposure | No secret in any client bundle; grep the build output | 05 §4 |

---

## 4. Repo hygiene plan (D9–D11)

Not urgent, but it is the difference between a repository someone can read next year and one
they cannot. Do this **after** the send, in the calm window 9–14 August.

1. **Doc canon (D9).** `relevant/10-docs/` is the canon per the project's own history;
   `nikah-web/files/docs/` is a stale copy. Pick `relevant/10-docs/`, delete `files/docs/`,
   and fix `nikah-web/AGENTS.md` so its "Read first" list points at real paths. Today it
   references `docs/01-concept-brief.md`, which does not exist — an agent following
   AGENTS.md literally cannot find the canon.
2. **Asset duplication (D10).** `nikah-web/content/` holds raw sources (65 tracked files,
   including four `.mp4`s) already represented in `assets/`. Stop tracking `content/`, keep
   it locally, and record in `relevant/10-docs/manifest.md` where the originals live. Do not
   rewrite git history before the wedding — a 722 MB `.git` is ugly, not dangerous.
3. **Orphan (D11).** Delete `nikah-web/guests.example.csv`; the script that read it
   (`scripts/generate-guest-links.mjs`) was removed with the `?to=` scheme.
4. **`.DS_Store`** is already gitignored; leave it.

---

## 5. Milestones

Each milestone has an exit criterion. Do not start the next one until the exit criterion is
literally true.

### M0 — Backend live · 29–31 Jul (D-24 → D-22) · **P0**

- Paste `SUPABASE_SECRET_KEY` into `nikah-web/.env`.
- Run `supabase/migrations/0001_guests.sql` in the Supabase SQL Editor.
- Run the smoke script (05 §2): create a guest, open their link, RSVP, submit a wish, see
  all three reflected in the dashboard.
- **Exit:** one real guest row exists and its full lifecycle has been observed end to end.

### M1 — Production deploy · 1–2 Aug (D-21 → D-20) · **P0**

- Buy `ourwedding.hanifahbashara.com`; point DNS at Vercel.
- Create the Vercel project; set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`,
  `DASHBOARD_PASSPHRASE`, `NEXT_PUBLIC_SITE_URL` on Production **and** Preview.
- Verify `https://ourwedding.hanifahbashara.com/undangan/<slug>` resolves and the dashboard
  logs in over HTTPS.
- **Exit:** a link generated by the production dashboard opens correctly on a real phone
  that has never seen the site.

### M2 — Pilot send · 3 Aug (D-19) · **P0**

- Enter 10 guests: 3 groom-family, 3 bride-family, 2 friends, 2 online.
- Send to those 10 only. Watch for: wrong honorific, broken link, message truncation,
  preview card looking wrong in WhatsApp, anything a guest asks about.
- **Exit:** all 10 opened their link and nobody had to ask a clarifying question.

### M3 — Full send · 4–8 Aug (D-18 → D-14) · **P0**

- Enter the remaining ~190 guests (use QuickAdd, 04 §4).
- Send in paced batches — 04 §6 covers pacing and WhatsApp's spam heuristics.
- **Exit:** every guest row has `invited_at` set.

### M4 — Chase and fill · 9–15 Aug (D-13 → D-7) · **P1**

- Fill `siteConfig.livestream` as the YouTube/Zoom/IG/FB links land; `/live` and every
  invitation update themselves.
- Reminder pass to non-responders at D-10 and D-8.
- Repo hygiene (§4), tests and CI (05 §2–3), gift decision (03 §5).
- **Exit:** RSVP deadline passes with a known, exportable guest count.

### M5 — Freeze and rehearse · 16–21 Aug (D-6 → D-1) · **P1**

- No code changes after 21 Aug except content values or a rollback.
- Full launch checklist (05 §7). Export the guest list to CSV and put it somewhere offline.
- Rehearse the D-day runbook: open `/live` on a phone with the real links in place.
- **Exit:** the launch checklist is fully ticked and a printed/offline guest list exists.

### M6 — D-day · 22 Aug · **P0**

- Follow 05 §8 exactly. The only thing that should happen to the codebase that day is
  possibly pasting a livestream URL.

### M7 — After · from 23 Aug · **P3**

- Export `rsvps` and `wishes`; archive them with the photos.
- Take `/dashboard` offline (remove `DASHBOARD_PASSPHRASE` or the deployment).
- Decide whether the site stays up as a memento (03 §10).

---

## 6. Risk register

| # | Risk | Likelihood | Impact | Mitigation | Owner doc |
|---|---|---|---|---|---|
| R1 | Domain not bought in time; links sent against a dead host | Medium | **Fatal** — sent links cannot be recalled | Buy before M1. Do not send a single invitation from a preview URL. | 05 |
| R2 | WhatsApp flags the account for bulk-identical messages | Medium | High — cannot send the rest | Pace to ~25/hour, vary the text per group, send to saved contacts first | 04 §6 |
| R3 | Supabase free-tier project paused for inactivity | Low | High — invitations 500 | Keep-warm ping, and `/undangan` already degrades to the generic invitation instead of erroring | 02 §7 |
| R4 | Slug or URL scheme changes after sending | Low | **Fatal** for early guests | Freeze the URL scheme at M2. Slugs are append-only after that. | 01 §1.1 |
| R5 | Open tracking inflated by link-preview bots, leading to "they opened it, they know" | High | Medium — social misread | Fix D3 before M3; treat `opened_count` as soft evidence | 02 §5 |
| R6 | Livestream links never materialise | Medium | Medium — online guests stranded | `/live` + inert pills already degrade honestly; keep the "menyusul" copy truthful | 03 §4 |
| R7 | Someone shares a venue link publicly and uninvited people arrive | Low | Medium | Venue details only behind a personal slug; the public page has none | 03 §2 |
| R8 | A guest edits the URL trying to see the venue | Low | Low | Invite type is not in the URL at all | 01 §3 |
| R9 | Dashboard passphrase leaks (it has been typed into chat logs) | Medium | High — 200 phone numbers | Rotate before M1; rotate again after the wedding | 05 §4 |
| R10 | The couple is too busy in the final week to fix anything | **High** | High | Freeze at D-1 and front-load everything to M0–M3 | 01 §5 |

---

## 7. Decision log

### Locked — do not relitigate

| # | Decision | Reason |
|---|---|---|
| L1 | Supabase Postgres, not Google Sheets | Guest lookup sits on the invitation's hot path; open tracking writes on every visit |
| L2 | Invite type resolved server-side, never in the URL | A guest must not be able to edit their way into the venue variant |
| L3 | Pretty slugs, typed per guest | The couple's call; also nicer in a WhatsApp preview |
| L4 | Unknown slug → public invitation, not 404 | WhatsApp truncates links; "not found" is a cruel thing for an invitation to say |
| L5 | Bare domain → online variant with generic greeting | That URL gets forwarded and pasted into bios; it must not carry the venue |
| L6 | The online invitation never explains itself | "Capacity is limited" is the sentence that tells someone they did not make the cut |
| L7 | `wa.me` prefill-and-tap-send, not the Business API | Free, works today, no Meta approval; "Sudah diundang" is therefore a manual checkbox |
| L8 | One shared passphrase, no accounts | Two people, one wedding; accounts would be ceremony without benefit |
| L9 | Phones stored E.164, `+` required for non-Indonesian numbers | Documented in `lib/phone.ts`; the dashboard echoes the normalised value back |
| L10 | RSVP and wishes moved off Apps Script onto Supabase | One store, one backup, and `guest_id` linkage becomes possible |

### Open — needs a human answer

| # | Question | Blocking | Default if nobody decides |
|---|---|---|---|
| O1 | Approve the new online copy (`copy.watch`, `copy.rsvpOnline`, `copy.faqOnline`, `closing.emphasisOnline`, six templates) | M2 | Ship as written; mirror into `03-copywriting.md` afterwards |
| O2 | Build the gift section? (D8 — conflicts with the earlier "no gift block" decision) | M4 | Do not build it |
| O3 | Keep `opened_count` visible in the dashboard once bot-filtering lands? | M4 | Keep, labelled as approximate |
| O4 | Does the site stay online after the wedding, and for how long? | M7 | Keep for 12 months, dashboard removed |
| O5 | Wishes moderation: pre-approve, or delete-after-the-fact? | M3 | Delete-after-the-fact, via a `hidden` flag |

### Implementation update — 2026-07-29

The default decisions were applied for O1, O2, O3, and O5: online copy is locked and mirrored; the gift section remains **DECIDED — NOT DOING**; confirmed opens are primary while raw opens remain approximate; wishes publish immediately and can be hidden afterwards. O4 remains a post-event decision.

All repository work in D3–D13 is implemented: confirmed-open tracking, Postgres login limiting, tests and CI, QuickAdd, online-copy canon, enforced server boundaries, canonical docs, duplicate asset cleanup, RSVP latest-answer view, and wishes moderation. `0003_delivery_metadata.sql` adds the alternative-channel and reminder fields required by 04.

The remaining gates are operational: configure Vercel/DNS, rotate secrets, add livestream URLs, run production Lighthouse/device/accessibility checks, send invitations, take exports, and execute the dated runbooks. M0 (secret + migrations + lifecycle smoke) passed on localhost 2026-07-29.
