# 02 — Data, Backend, and API

**Owns:** Supabase schema and migrations, the server modules that talk to it, every API
route contract, validation, rate limiting, backup and export.
**Does not own:** what the browser renders (03), how the dashboard uses these endpoints (04),
tests and deployment (05).

---

## 1. Why Postgres and not Sheets

The guest table sits on the **hot path of every invitation open**: `/undangan/<slug>` cannot
render until the slug resolves. On top of that, every open writes a counter. Google Apps
Script answers in roughly half a second, is quota-limited, and serialises concurrent writes —
acceptable for a form that fires once per guest, wrong for a lookup that fires on every page
view and a write that fires alongside it.

Supabase also gives, for free and without extra work: a spreadsheet-like table editor for
manual fixes, SQL for the one or two reports that will be wanted (who has not replied), real
constraints that keep bad data out, and one place to back up instead of three.

---

## 2. The schema as it stands

Source of truth: `nikah-web/supabase/migrations/0001_guests.sql`. Mirrored by hand into
`nikah-web/lib/db.types.ts` — **change both together, in the same commit.**

### 2.1 `guests`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK, `gen_random_uuid()` | |
| `slug` | `text` unique, `^[a-z0-9]+(-[a-z0-9]+)*$` | Typed by the couple. Forms `/undangan/<slug>`. **The invite type is deliberately not here or anywhere in the URL.** |
| `display_name` | `text` not null, non-blank | Printed verbatim on the gate, honorific included ("Bapak Achmad Fuad Bay"). |
| `whatsapp_name` | `text` null | Informal name used in the message only ("Om Fuad"). |
| `phone` | `text` null, `^[1-9][0-9]{7,14}$` | E.164 digits, no `+`. Exactly what `wa.me` wants. |
| `guest_group` | `guest_group` enum | `groom_family` · `bride_family` · `friend`. Chooses the template. |
| `invite_type` | `invite_type` enum | `venue` · `online`. Chooses the invitation variant. |
| `party_label` | `text` default `''` | "Beserta Keluarga" or empty. Rendered under the name on the gate. |
| `party_max` | `smallint` default 2, 1–10 | Caps that guest's RSVP party selector. |
| `message_override` | `text` null | Null means "follow the group template". |
| `notes` | `text` null | Private. Never leaves the dashboard. |
| `invited_at` | `timestamptz` null | Set by the "Sudah diundang" checkbox. |
| `opened_count` | `integer` default 0 | See §5 — currently inflated by crawlers. |
| `opened_first_at`, `opened_last_at` | `timestamptz` null | |
| `created_at`, `updated_at` | `timestamptz` | `updated_at` maintained by the `guests_set_updated_at` trigger. |

Indexes: `guest_group`, `invite_type`, `created_at desc`.

### 2.2 `rsvps`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `guest_id` | `uuid` null → `guests(id) on delete set null` | Null when the RSVP came from the public page or an unknown slug. **Null is a feature:** a cousin using a forwarded link should not lose their answer. |
| `nama` | `text` not null | As typed. |
| `kehadiran` | `text` + check | `Hadir` · `Tidak Hadir` · `Masih Diusahakan` · `Menyaksikan Daring` |
| `jumlah` | `smallint` 1–10 | Clamped server-side to the guest's `party_max`. |
| `catatan` | `text` default `''` | |
| `user_agent` | `text` null | Kept for spam forensics only. |
| `created_at` | `timestamptz` | |

### 2.3 `wishes`

`id`, `guest_id` (nullable FK), `nama`, `pesan`, `created_at`. Read publicly by
`GET /api/wishes` (newest 200).

### 2.4 Security posture

RLS is **enabled with zero policies** on all three tables. That is not an oversight:

- The publishable key can therefore read and write **nothing**. Even if it is pasted into a
  chat, a screenshot, or a public repo, it opens no door.
- The secret key bypasses RLS and lives only in server environment variables.
- The browser never calls Supabase. There is no `createBrowserClient` anywhere, and there
  should never be one. If a future feature seems to need it, add a route handler instead.

Verification (do this once after M1 deploy): grep the built client bundles for
`supabase.co` and for the first eight characters of the secret key. Both must return nothing.
Exact command in 05 §4.

---

## 3. Server modules

### 3.1 `lib/supabaseAdmin.ts`

Lazily constructs and caches one client. `supabaseConfigured()` is the guard every caller
uses so an unwired environment degrades to a 503 with a Indonesian-readable message instead
of a stack trace. `auth: { persistSession: false, autoRefreshToken: false }` because there
are no Supabase users here — the only identity is the dashboard passphrase.

### 3.2 `lib/guests.ts`

Owns validation and every query. Notable behaviours worth keeping:

- `validateGuestInput` throws `GuestError("INVALID_INPUT", <Indonesian message>)`. The
  message is intended to be shown to the couple verbatim, so it must stay in Indonesian and
  stay specific ("Nomor WhatsApp tidak valid", not "validation failed").
- `cleanText` strips control characters and anything that looks like a tag before length
  clamping. Applied to every free-text field.
- Empty slug falls back to `slugify(display_name)` — convenience, not magic: the dashboard
  shows the resolved slug before saving.
- Postgres `23505` is translated into `SLUG_TAKEN` so the UI can say which slug clashed.
- `listGuests()` runs two queries and merges in memory. At 200 guests and maybe 250 RSVPs
  this is a few milliseconds. **The ceiling is roughly 2,000 rows**; past that, move to a
  SQL view. Written down so nobody has to rediscover it.
- `trackOpen()` deliberately swallows its error into a `console.error`. An analytics counter
  must never break an invitation.

### 3.3 `lib/auth.ts`

`DASHBOARD_PASSPHRASE` never reaches the browser. The cookie is `<expiryMs>.<hmac>` — it
carries no identity, so stealing it grants exactly what stealing a session cookie should:
a session, until it expires. `timingSafeEqual` on both the passphrase check and the
signature check. Cookie flags: `httpOnly`, `sameSite: lax`, `secure` in production, 30 days.

Auth is intentionally checked in **route handlers and server components (Node runtime)**,
not Edge middleware, because `node:crypto` is unavailable at the edge. Do not "optimise"
this into middleware without replacing the HMAC with a Web Crypto implementation.

---

## 4. Planned migrations

### `0002_tracking_and_dedupe.sql` — **P1, before M3**

Three changes, one file.

**(a) Bot-resistant open tracking (D3).** Split the counter so real opens are
distinguishable from link-preview fetches:

```sql
alter table guests
  add column if not exists opened_confirmed_count integer not null default 0,
  add column if not exists opened_confirmed_at timestamptz;

-- Called only from the gate tap, never from a page render.
create or replace function confirm_guest_open(guest_slug text) returns void
language sql
as $$
  update guests
     set opened_confirmed_count = opened_confirmed_count + 1,
         opened_confirmed_at = now(),
         opened_last_at = now()
   where slug = guest_slug;
$$;
```

**(b) RSVP dedupe view (D12).** Keep every submission for the audit trail, but make "the
answer" unambiguous:

```sql
create or replace view latest_rsvps as
select distinct on (guest_id) *
  from rsvps
 where guest_id is not null
 order by guest_id, created_at desc;
```

**(c) Wishes moderation (D13):**

```sql
alter table wishes add column if not exists hidden boolean not null default false;
create index if not exists wishes_visible_idx on wishes (created_at desc) where not hidden;
```

`GET /api/wishes` then filters `hidden = false`, and the dashboard grows a "sembunyikan"
action.

### `0003_*.sql` — only if something real demands it

Do not pre-build. Migrations after the send are a risk, not a virtue.

**Migration discipline:** numbered, forward-only, idempotent (`if not exists`, `create or
replace`, the `do $$ … exception when duplicate_object` guard used for enums in 0001). Run by
hand in the SQL Editor; record the date each one was run at the bottom of this section.

| Migration | Run on | By |
|---|---|---|
| `0001_guests.sql` | 2026-07-29 | applied via Supabase MCP (`apply_migration` → `guests`) |
| `0002_tracking_and_dedupe.sql` | 2026-07-29 | applied via Supabase MCP (`tracking_and_dedupe`) |
| `0003_delivery_metadata.sql` | 2026-07-29 | applied via Supabase MCP (`delivery_metadata`) |
| M0 lifecycle smoke | 2026-07-29 | localhost: create → open → confirm open → RSVP → wish → export → hide wish → delete; `/api/health` ok |

---

## 5. Open tracking is currently wrong (D3) — **P1**

**The problem.** When a `wa.me` message containing a link is delivered, WhatsApp fetches that
URL server-side to build the preview card. Facebook does the same. Both hit
`/undangan/<slug>`, which calls `after(() => trackOpen(slug))`. So `opened_count` increments
the moment the message is *sent*, before any human has seen it.

This is not a cosmetic bug. The couple will read "dibuka 2×" as "they have seen it and are
ignoring us", which is a social conclusion drawn from an artefact of link previews.

**The fix, in two layers:**

1. **Filter the obvious crawlers** in the page's tracking call:

```ts
// app/undangan/[slug]/page.tsx
import { headers } from "next/headers";

const CRAWLER = /whatsapp|facebookexternalhit|twitterbot|telegrambot|slackbot|discordbot|bot|crawler|preview/i;

const ua = (await headers()).get("user-agent") ?? "";
if (!CRAWLER.test(ua)) after(() => trackOpen(slug));
```

2. **Count a confirmed open only on the gate tap**, which no crawler performs. Add
   `POST /api/track/open { slug }` calling `confirm_guest_open`, fired from `Gate.handleOpen`
   alongside `unlock()`. Fire-and-forget, `keepalive: true`, never blocking the ritual.

The dashboard then shows *confirmed* opens as the real number, with raw `opened_count`
demoted to a tooltip. Acceptance: sending a message to a test number must not increment the
confirmed counter until a human taps "Buka Undangan".

---

## 6. Rate limiting is close to decorative (D4) — **P1**

`lib/rateLimit.ts` keeps a `Map` in instance memory: 5 requests per IP per 60 s. On Vercel,
requests spread across instances that each start with an empty map, and instances recycle.
Its honest description is "a speed bump against one person hammering one form", which is
most of the real threat here.

The one endpoint where this matters is `POST /api/dashboard/session`, because a single shared
passphrase plus unlimited attempts is a guessable lock.

**Target (P1, before M1):** move the login limiter into Postgres so it survives instances.

```sql
create table if not exists auth_attempts (
  ip text not null,
  attempted_at timestamptz not null default now()
);
create index if not exists auth_attempts_ip_idx on auth_attempts (ip, attempted_at desc);
```

Before checking the passphrase: count attempts for that IP in the last 15 minutes; over 10,
return 429 without comparing. Insert a row on every failure; delete that IP's rows on
success. A daily `delete from auth_attempts where attempted_at < now() - interval '7 days'`
keeps it small.

Keep the in-memory limiter on `/api/rsvp` and `/api/wishes` — the honeypot plus a check
constraint is enough there, and a database round trip per RSVP is not worth it.

**Also P1:** the passphrase in use (`nikah2026`) is short, guessable, and has been typed into
chat logs. Rotate to something long before M1 (05 §4).

---

## 7. Operational concerns

### 7.1 Free-tier pausing (R3)

Supabase pauses free projects after a week of inactivity. During the send-and-RSVP window
there will be daily traffic, so the practical risk is the quiet stretch **before** M2 and
**after** the wedding. Two mitigations, both cheap:

- Open the Supabase dashboard once in any quiet week (that counts as activity).
- `/api/health` (05 §6) does a `select 1` against `guests`; hit it from any uptime pinger
  every 6 hours during August.

Note the graceful degradation already in place: if Supabase is unreachable,
`/undangan/<slug>` logs and renders the **generic online invitation** rather than an error
page. A guest sees a slightly less personal invitation instead of a broken site. Preserve
that behaviour in any refactor.

### 7.2 Backups and export — **P1 before M4**

The free tier's automated backup story is thin, and the data that matters (who is coming,
what they wrote) is irreplaceable after the day.

- Add `GET /api/dashboard/export?table=guests|rsvps|wishes` returning CSV, session-guarded,
  with `Content-Disposition: attachment`.
- Add an "Unduh CSV" button to the dashboard header.
- **Manual ritual:** export all three on 15 Aug (RSVP deadline), 21 Aug (freeze), and
  23 Aug (after). Store them outside the repo — email them to yourselves.
- Do **not** commit exports; they are 200 people's phone numbers.

### 7.3 What we deliberately do not build

| Not building | Why |
|---|---|
| WhatsApp Business Cloud API | Meta approval, template review, per-message cost, and a fortnight of lead time for a one-day event |
| Realtime subscriptions | Two operators, one screen; a reload is fine |
| Supabase Auth / per-user accounts | Two people share one passphrase (L8) |
| Row pagination | 200 rows |
| An admin audit log | Two trusted operators |
| Soft delete | `DELETE` behind a `confirm()`; the CSV export is the undo |

---

## 8. API contracts

Every response is `{ success, data?, error?, meta? }`. Every error carries a machine `code`
and an Indonesian, guest-safe `message`.

### 8.1 `POST /api/rsvp` — public

Request: `{ slug?, nama, kehadiran, jumlah, catatan?, website }`

| Status | Code | When |
|---|---|---|
| 200 | — | Stored, or honeypot tripped (identical response by design) |
| 400 | `INVALID_JSON` / `INVALID_PAYLOAD` | Unparseable body; missing `nama` or invalid `kehadiran` |
| 429 | `RATE_LIMITED` | In-memory limiter |
| 500 | `WRITE_FAILED` | Insert failed |
| 503 | `NOT_CONFIGURED` | Supabase env vars missing |

Behaviours to preserve: honeypot returns success and stores nothing; unknown slug still
records the RSVP with `guest_id = null`; `jumlah` is clamped to the guest's `party_max`
server-side, never trusted from the client.

### 8.2 `GET|POST /api/wishes` — public

GET returns `{ wishes: [{ nama, pesan, timestamp }] }`, newest 200. POST accepts
`{ nama, pesan, slug?, website }`, links `guest_id` when the slug resolves. Same code table
as RSVP, plus `READ_FAILED` (500) on GET.

### 8.3 `POST|DELETE /api/dashboard/session`

POST `{ passphrase }` → sets the cookie. `401 UNAUTHORIZED` on mismatch, `429 RATE_LIMITED`
first (the limiter runs before the comparison, deliberately), `503 NOT_CONFIGURED` when
`DASHBOARD_PASSPHRASE` is unset. DELETE clears the cookie and always succeeds.

### 8.4 `GET|POST /api/dashboard/guests` · `PATCH|DELETE /api/dashboard/guests/[id]`

Session-guarded. GET returns `{ guests: GuestWithRsvp[] }` with `meta.count`. POST returns
`201` with the created row. PATCH accepts either a full guest body **or** exactly
`{ invited: boolean }` — the second form is the one-tap checkbox and touches nothing else.
`409 SLUG_TAKEN`, `404 NOT_FOUND` for a non-UUID or missing id, `400 INVALID_INPUT` with the
Indonesian message from `GuestError`.

### 8.5 Planned

| Endpoint | Purpose | Priority |
|---|---|---|
| `POST /api/track/open` | Confirmed open from the gate tap (§5) | P1 |
| `GET /api/dashboard/export` | CSV export (§7.2) | P1 |
| `GET /api/health` | `select 1` liveness (§7.1) | P2 |
| `PATCH /api/dashboard/wishes/[id]` | `{ hidden }` moderation (§4c) | P2 |

---

## 9. Task list for this document

| # | Task | Priority | Exit criterion |
|---|---|---|---|
| B1 | Paste `SUPABASE_SECRET_KEY`, run `0001` | **P0** | Dashboard lists guests instead of "belum tersambung" |
| B2 | Smoke the full lifecycle against real Supabase | **P0** | 05 §2 script passes |
| B3 | Crawler filter + `POST /api/track/open` + `0002(a)` | P1 | Sending to a test number does not increment confirmed opens |
| B4 | Postgres-backed login limiter + rotate passphrase | P1 | 11th bad login in 15 min returns 429 on a fresh instance |
| B5 | CSV export endpoint + dashboard button | P1 | Three CSVs downloaded and stored off-repo |
| B6 | `latest_rsvps` view + dashboard reads it | P2 | A guest who answers twice shows one status |
| B7 | Wishes `hidden` flag + moderation action | P2 | A hidden wish disappears from the public wall |
| B8 | `/api/health` + external ping | P2 | Endpoint returns 200 with a row count |
| B9 | `import "server-only"` in the five server modules | P1 | A deliberate client import fails the build |

## 10. Implementation update — 2026-07-29

B3–B9 are implemented in the repository. Migration 0002 contains confirmed-open counters, the security-invoker latest-RSVP view, wishes moderation, a Postgres login-attempt store, explicit RLS/grants, and restricted RPC execution. Migration 0003 adds delivery metadata. The dashboard reads the view, uses confirmed opens, exports all three tables, moderates wishes, and exposes `/api/health`.

B1 and B2 were completed on 2026-07-29: `SUPABASE_SECRET_KEY` is in local `.env`, migrations `0001`–`0003` are applied on project `xwqlmdtxzcfygnvoowhx`, and the M0 lifecycle smoke passed on localhost (create → open → confirmed open → RSVP → wish → CSV export → hide wish → delete). The passphrase rotation and external six-hour uptime check remain operator actions.
