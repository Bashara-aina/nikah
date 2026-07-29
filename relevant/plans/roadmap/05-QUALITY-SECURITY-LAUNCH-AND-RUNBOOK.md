# 05 — Quality, Security, Launch, and the D-Day Runbook

**Owns:** tests, CI, security review, deployment, the launch checklist, the runbook for
22 August, incident response, and what happens after.
**Does not own:** schema (02), guest experience (03), the send operation (04).

---

## 1. Where quality stands today

`tsc --noEmit`, `eslint .`, and `next build` all pass, and every claim in this repo about the
guest system having been *seen working* refers to a manual browser pass against a production
build on 2026-07-29. There are **no automated tests and no CI**. Every regression is
currently caught by a human remembering to look.

That is survivable for a two-week project with one engineer, but there are three specific
places where a silent regression would be expensive, and those are exactly what §2 covers:

1. **`lib/phone.ts`** — a normalisation bug sends messages to the wrong number, or to nobody.
2. **`lib/waTemplates.ts`** — a placeholder bug sends 200 people a message containing the
   literal text `{nama}`.
3. **`lib/auth.ts`** — a comparison bug opens the guest list to the internet.

None of these are visible in a screenshot.

---

## 2. Testing strategy

### 2.1 Unit tests — **P1, land before M3**

Vitest, no JSX, no DOM. Everything under test is a pure function.

```bash
npm i -D vitest
```

```jsonc
// package.json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: { environment: "node", include: ["lib/**/*.test.ts"] },
});
```

**`lib/phone.test.ts`** — the table below is the specification; each row is a case.

| Input | Expected `normalizePhone` | Why it is in the list |
|---|---|---|
| `"0812-3456-7890"` | `"6281234567890"` | The common Indonesian form |
| `"+62 812 3456 7890"` | `"6281234567890"` | Already international |
| `"62 812 3456 7890"` | `"6281234567890"` | Country code, no plus |
| `"812 3456 7890"` | `"6281234567890"` | Local without the leading zero |
| `"+81 90-1234-5678"` | `"819012345678"` | Japan — the documented `+` requirement |
| `"00812345678"` | `"6281234567890"`-shaped, no leading zero | Multiple leading zeros stripped |
| `""`, `null`, `undefined`, `"abc"` | `null` | Empty and junk |
| `"123"` | `null` | Below the 8-digit floor |
| 16+ digits | `null` | Above the E.164 ceiling |
| round-trip | `formatPhone(normalizePhone(x))` starts with `+` | Display never loses the plus |
| `whatsappLink(null, "hi")` | `null` | No number, no link |
| `whatsappLink("62812…", "a b&c")` | text is percent-encoded | A raw `&` would truncate the message |

**`lib/slug.test.ts`** — `slugify` on accented input, spaces, punctuation, honorifics
("Bapak Achmad Fuad Bay & Keluarga" → `bapak-achmad-fuad-bay-keluarga`), 60-char clamp, and
`isValidSlug` rejecting uppercase, leading/trailing/double hyphens, empty, and 81 characters.
Property: `isValidSlug(slugify(x))` for any non-empty `x` containing at least one
alphanumeric.

**`lib/waTemplates.test.ts`** —
- All six keys exist and are non-empty.
- Every template contains `{nama}` and `{link}`.
- `renderMessage` leaves **no** `{` in the output, for all six templates.
- `whatsapp_name` wins over `display_name`; a blank one falls back.
- `message_override` wins over the template, and its placeholders still resolve.
- **The online templates contain none of:** `Bandung`, `Widuri`, `Ciliwung`, `alamat`,
  `dress code`, `terbatas`. This is the one test that guards the social contract in 03 §1.

**`lib/auth.test.ts`** — with `DASHBOARD_PASSPHRASE` set in the test env:
`passphraseMatches` true for the exact value, false for a prefix, a suffix, a different
length, and the empty string; `verifySession(issueSession().value)` true; tampering with
either half false; an expired timestamp false; a token signed with a different secret false;
`verifySession(undefined)` false; everything false when the env var is unset.

**`lib/guests.validation.test.ts`** — `validateGuestInput`: rejects a blank display name, an
invalid slug, an unknown group or invite type, and an unparseable phone; derives the slug
from the name when absent; clamps `party_max` into 1–10; strips tags and control characters;
returns `null` (not `""`) for empty optional fields.

**Coverage target:** 100% of the branches in those five modules. Not a coverage target for
the app as a whole — React sections are verified by eye and by the smoke pass.

### 2.2 The M0 smoke pass — **P0, blocks everything**

Nothing data-backed has run yet. Do this by hand, in order, and only call M0 done when every
line is true.

1. `SUPABASE_SECRET_KEY` in `nikah-web/.env`; `0001_guests.sql` run in the SQL Editor.
2. `npm run build && npm run start` locally.
3. `/dashboard` → sign in → list renders empty, no error.
4. Create a guest: name with an honorific, slug, your own phone, `venue`, `groom_family`,
   party label "Beserta Keluarga", `party_max` 4.
5. The card shows the normalised phone. **Kirim WhatsApp** opens WhatsApp with the message
   prefilled; name, date and link are resolved, no `{` remains.
6. Open the link on a phone. The gate greets the guest by name with the party label beneath.
7. Tap through, reach the RSVP, submit "Hadir", 3 orang, with a note.
8. Submit a wish.
9. Reload the dashboard: the card shows the RSVP status, the party count, the note, and an
   open count.
10. Create a second guest with `invite_type: online`. Their link shows **Cara Menyaksikan**,
    the online RSVP, the online FAQ, the online closing — and **no address anywhere**.
11. Visit `/undangan/tidak-ada-orang-ini` → generic online invitation, no error.
12. Visit `/` → generic online invitation.
13. Edit the first guest's name; reload their link; the new name appears.
14. Untick and re-tick "Sudah diundang"; the timestamp clears and returns.
15. Delete the second guest; the card disappears and their link falls back to generic.

Write the result of this pass at the bottom of 02 §4's migration table with a date.

### 2.3 Browser smoke — **P2**

One Playwright spec covering: `/` renders the gate; `/live` lists four channels;
`/dashboard` shows the passphrase form; a wrong passphrase shows an error; the right one
reaches the list. Guard the last two behind an env-provided passphrase so the spec can run in
CI against a preview deployment. Optional — the manual pass in §2.2 covers the same ground
and the project has two weeks to live.

---

## 3. Continuous integration — **P1**

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: nikah-web
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: nikah-web/package-lock.json
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm test
      - run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: https://ourwedding.hanifahbashara.com
```

The build step needs no secrets: every server module degrades to a 503 when its env vars are
absent, which is exactly what makes it CI-friendly.

**Also P1 — `server-only` enforcement.** Install `server-only` and add the import at the top
of `lib/supabaseAdmin.ts`, `lib/guests.ts`, `lib/auth.ts`, `lib/rateLimit.ts`, and
`lib/dashboardApi.ts`. Any client component that imports them then fails the build with a
clear message instead of silently pulling server code toward the browser. Verify by
temporarily importing `lib/guests` into a `"use client"` file and confirming the build fails.

---

## 4. Security review

Run this list once before M1 and once at the freeze.

### 4.1 Secrets

- [ ] `.env` is gitignored (`.env`, `.env.*`, except `.env.example`) — confirmed.
- [ ] `.env.example` contains **no values**.
- [ ] `git log -p -- nikah-web/.env` returns nothing.
- [ ] No secret has a `NEXT_PUBLIC_` prefix.
- [ ] The client bundle contains neither the Supabase host nor the secret:

```bash
grep -rl "supabase.co" nikah-web/.next/static 2>/dev/null; echo "exit: $?"
```

Expect no file list. Repeat with the first eight characters of the secret key.

- [ ] **Rotate `DASHBOARD_PASSPHRASE` before M1.** The current value is short and has been
      typed into chat logs. Use four or more unrelated words. Update Vercel and `.env`
      together — they are independent, and a mismatch locks you out of production only.
- [ ] **Rotate `FAL_KEY`** if convenient; it was printed into a session log on 29 July. It
      only guards image generation spend, so this is P3.
- [ ] After the wedding, unset `DASHBOARD_PASSPHRASE` in production (M7).

### 4.2 Access control

- [ ] Every `/api/dashboard/*` handler calls `hasDashboardSession()` **before** touching
      Supabase. Re-read all four route files; there is no middleware safety net by design.
- [ ] Cookie flags: `httpOnly`, `sameSite: lax`, `secure` in production, 30-day expiry.
- [ ] Both passphrase and signature comparisons use `timingSafeEqual`.
- [ ] The login limiter runs **before** the comparison (02 §6).
- [ ] RLS is on for all three tables and no policy has been added.

### 4.3 Data exposure

- [ ] `InvitationGuest` (`lib/invitation.ts`) is the only guest shape reaching the browser:
      slug, display name, invite type, party label, party max. **No phone, no notes, no
      timestamps.** Verify by reading the RSC payload of a guest page for a phone number.
- [ ] An unknown slug reveals nothing about which slugs exist — it renders the generic
      invitation identically to `/`.
- [ ] `console.error` calls log slugs and ids, never phone numbers.
- [ ] `robots: { index: false, follow: false }` still set site-wide.
- [ ] No CSV export is committed.

### 4.4 Input handling

- [ ] `cleanText` strips control characters and tag-like sequences on every free-text field,
      in both the API routes and `validateGuestInput`.
- [ ] Honeypot `website` on both public forms returns success and stores nothing.
- [ ] `jumlah` is clamped server-side to the guest's `party_max`.
- [ ] `kehadiran` is validated against the same list the database check constraint enforces.
- [ ] Slug format is validated in the app *and* by a database constraint.

---

## 5. Deployment

### 5.1 Vercel project

Root directory `nikah-web`, framework Next.js, Node 22, build `npm run build` (its `prebuild`
mirrors assets), install `npm ci`.

### 5.2 Environment variables

| Variable | Production | Preview | Development | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://ourwedding.hanifahbashara.com` | the preview URL | `http://localhost:3000` | **Every generated guest link is built from this.** Wrong here means dead links in sent messages. |
| `SUPABASE_URL` | ✅ | ✅ | ✅ | Same project everywhere — there is no staging database, and creating one for a two-week project is not worth the drift. |
| `SUPABASE_SECRET_KEY` | ✅ | ✅ | ✅ | Never `NEXT_PUBLIC_`. |
| `DASHBOARD_PASSPHRASE` | ✅ (rotated) | ✅ (may differ) | ✅ | |
| `FAL_KEY` | ❌ | ❌ | ✅ local only | Script-only; never needed by the site. |

Because preview and production share one database, **treat any preview dashboard as live**.

### 5.3 Domain

1. Buy `hanifahbashara.com` (or the zone that owns it).
2. In Vercel, add `ourwedding.hanifahbashara.com` to the project.
3. At the registrar, add the CNAME Vercel shows (`ourwedding` → `cname.vercel-dns.com`).
4. Wait for the certificate to issue; confirm `https://` resolves with a valid padlock.
5. Set `NEXT_PUBLIC_SITE_URL` to the final origin and **redeploy** — the value is baked in at
   build time.
6. Generate a fresh link from the production dashboard and open it on a phone that has never
   visited the site.

**Do not send a single invitation before step 6 passes.** A sent link cannot be recalled.

### 5.4 Deployment discipline

- `main` is what deploys. Work on `feature/*`; open a PR; merge only with CI green.
- After every production deploy, spot-check: one venue link, one online link, `/live`,
  `/dashboard` login.
- After **21 August**, deploy nothing that is not a content value or a rollback.

---

## 6. Monitoring

Modest and sufficient:

- `GET /api/health` (P2): `select 1` against `guests`, returns `{ ok, guests }` or a 503.
  No auth, no counts beyond a row total, nothing sensitive.
- Point any free uptime checker at `/` and `/api/health` every 6 hours through August. This
  doubles as the Supabase keep-warm (02 §7.1).
- Vercel function logs are the first place to look for a 500; Supabase logs for a failed query.
- No analytics beyond `opened_count`. Guests are not being measured.

---

## 7. Launch checklist

### 7.1 Before the first invitation (gate for M2)

**Data**
- [ ] Migration `0001` run; smoke pass §2.2 complete.
- [ ] At least ten real guest rows entered and reviewed.

**Correctness**
- [ ] `npm test` green; CI green on `main`.
- [ ] `type-check`, `lint`, `build` green.
- [ ] `next build` route table unchanged: `/` and `/live` static, `/undangan/[slug]` and
      `/dashboard` dynamic.

**Content**
- [ ] Copy signed off and mirrored into `03-copywriting.md` (03 §5, task C1).
- [ ] All six templates read aloud; online templates pass the no-venue test.
- [ ] Names, parents' names, date, time, venue, and the RSVP deadline checked against reality.

**Delivery**
- [ ] Domain live with a valid certificate; `NEXT_PUBLIC_SITE_URL` matches and was redeployed.
- [ ] A production link opened successfully on a phone that never saw the site.
- [ ] Passphrase rotated.

**Experience**
- [ ] Venue link checked on iOS Safari and Android Chrome.
- [ ] Online link checked on both; **no address anywhere**.
- [ ] Reduced-motion pass.
- [ ] Arch overlay contrast checked (03 §7, A1).

### 7.2 Before the freeze (gate for M5, 21 August)

- [ ] Every guest has `invited_at`.
- [ ] Livestream URLs in `lib/config.ts`, deployed, and `/live` verified.
- [ ] Every online guest told the links are live.
- [ ] CSV exports for guests, rsvps, wishes taken and stored off-repo.
- [ ] A printed or offline copy of the attending list exists.
- [ ] Confirmed-open tracking live; raw count demoted.
- [ ] Repo hygiene done (01 §4) or consciously deferred.
- [ ] Security review §4 re-run.
- [ ] Rollback rehearsed: know how to promote the previous deployment in Vercel.

---

## 8. D-day runbook — 22 August 2026

The only acceptable code change today is pasting a livestream URL.

| Time (WIB) | Action | Who |
|---|---|---|
| 07.00 | Open `/live` on a phone. All four pills live and clickable? | Bashara |
| 07.15 | Open one venue link and one online link. Both load in under three seconds on mobile data. | Either |
| 07.30 | `/api/health` returns ok. | Bashara |
| 08.00 | Post the `/live` link to Instagram and Facebook stories as promised (03 §4). | Either |
| 09.30 | Someone not in the wedding party is nominated to watch the stream chat and answer "where do I watch". | Nominee |
| 09.45 | Final check that the stream is actually broadcasting on every channel listed. | Nominee |
| 10.00 | **Akad.** Nobody touches the codebase. | — |
| 13.00 | Resepsi ends. | — |
| Evening | Export all three CSVs. Screenshot the wishes wall. | Bashara |

**If something breaks during the day, the answer is almost always "post the direct YouTube
link in the group chat".** Do not debug a Next.js route while getting married.

### 8.1 Incident playbook

| Symptom | First response | Then |
|---|---|---|
| Site returns 500 | Promote the previous deployment in Vercel | Investigate afterwards |
| Supabase unreachable | Nothing — `/undangan` already degrades to the generic invitation | Confirm the project is not paused |
| Guest links dead after a deploy | Check `NEXT_PUBLIC_SITE_URL`; a wrong value breaks every generated link | Redeploy with the right value |
| Locked out of the dashboard | Check the Vercel env value; the cookie is signed with it, so changing it invalidates sessions | Rotate deliberately, not in a panic |
| Stream link wrong in the invitation | Fix `lib/config.ts`, deploy, and post the correct link in the group chat immediately | The chat reaches people faster than a deploy |
| Someone reports seeing another guest's page | Expected if they were sent that link; slugs are not secrets, only invite types are protected | No action |

---

## 9. After the wedding

| When | Action |
|---|---|
| 23 Aug | Export guests, rsvps, wishes. Store with the photos, outside the repo. |
| 23 Aug | Unset `DASHBOARD_PASSPHRASE` in production; the dashboard becomes unreachable. |
| Within a week | Decide O4 (03 §10): take down, keep as-is, or freeze into a memento. |
| Within a week | Thank-you messages, using the exported list rather than the live dashboard. |
| Within a month | If keeping the site: remove RSVP endpoints, keep the wishes wall read-only, and note the change in `lib/copy.ts`. |
| Whenever | Repo hygiene (01 §4) if it was deferred, and a final `git tag wedding-day` on the commit that was live on 22 August. |

---

## 10. Task list for this document

| # | Task | Priority | Exit criterion |
|---|---|---|---|
| Q1 | M0 smoke pass §2.2 | **P0** | All 15 steps true |
| Q2 | Vitest + the five test files | **P1** | `npm test` green, all §2.1 cases present |
| Q3 | CI workflow | **P1** | Green check on a PR |
| Q4 | `server-only` in the five server modules | **P1** | A deliberate client import fails the build |
| Q5 | Security review §4, first pass | **P1** | Every box ticked before M1 |
| Q6 | Domain + env + redeploy + phone verification | **P0** | §5.3 step 6 passes |
| Q7 | `/api/health` + external ping | P2 | 200 with a row count |
| Q8 | Playwright smoke | P2 | Spec passes against a preview |
| Q9 | Security review, second pass at freeze | P1 | Every box ticked again on 21 Aug |
| Q10 | Post-event exports and dashboard shutdown | P1 | Done by 23 Aug |

## 11. Implementation update — 2026-07-29

Q1 is complete on localhost (2026-07-29): migrations `0001`–`0003` applied, and the 15-step lifecycle smoke passed against the real Supabase project. Q2, Q3, Q4, Q7, and Q8 remain complete. Vitest runs 64 cases; Playwright covers the public gate, four-channel `/live` degradation, wrong dashboard passphrase, and successful session transition. CI runs install, type-check, lint, unit tests, and build on Node 22.

Q5/Q9’s production-bundle checks, Q6 (domain + Vercel), the external uptime monitor, production device/Lighthouse checks, dated launch lists, D-day actions, and Q10 remain human/external work.
