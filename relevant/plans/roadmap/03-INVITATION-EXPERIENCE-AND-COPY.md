# 03 — The Invitation Experience and Copy

**Owns:** both invitation variants, `/live`, all guest-facing copy, motion, accessibility,
performance, and how the link looks when it lands in WhatsApp.
**Does not own:** the data behind the guest (02), the dashboard (04), deployment (05).

---

## 1. The principle the whole design hangs on

There are two invitations and they must feel like **two invitations**, not one invitation and
its abridgement.

A guest watching from Jakarta or Tokyo should be able to read their page start to finish and
never once detect that a different, fuller version exists. That means the online variant is
not allowed to:

- mention the venue, the address, the map, or the dress code;
- explain why the reader is not being asked to come ("tempat terbatas", "acara intim");
- leave a visible hole where a section was removed;
- be meaningfully shorter than the venue variant.

And it must positively offer something to do: watch, confirm, write a doa. A guest with an
action does not feel like a spectator.

The framing choice was explicit (01 §7, L6): acknowledge the livestream warmly, never
justify. "Capacity is limited" is exactly the sentence that tells someone they did not make
the cut, so it does not appear anywhere.

---

## 2. Route map and what each page may contain

| Route | Variant | Venue details? | Who reaches it |
|---|---|---|---|
| `/` | online, generic greeting | **Never** | Anyone with the forwarded/bio link |
| `/undangan/<slug>` where `invite_type = venue` | venue | Yes | Personally invited to Bandung |
| `/undangan/<slug>` where `invite_type = online` | online | **Never** | Personally invited to the livestream |
| `/undangan/<unknown>` | online, generic greeting | **Never** | Mistyped or truncated link |
| `/live` | livestream landing | **Never** | Anyone; linked from every invitation and every message |

The rule underneath the table: **venue details exist only behind a personal slug whose row
says `venue`.** There is no other path to the address in the entire app. That is what makes
a forwarded link harmless.

---

## 3. Section-by-section specification

Phase machine (`components/Invitation.tsx`): `loading → gate → open`. A same-session refresh
skips straight to `open` via `sessionStorage["nikah:opened"]`.

| # | Section | Component | Venue | Online | Notes |
|---|---|---|---|---|---|
| L1 | Loading | `sections/Loading.tsx` | ✅ | ✅ | 1600 ms calm beat on first visit only |
| L2 | Gate | `sections/Gate.tsx` | ✅ | ✅ | Guest name + `party_label` from `useGuest()`; single ritual unlock (gyro permission → audio → open) |
| L3 | Hero | `hero/Hero.tsx` | ✅ | ✅ | Video loop, sky band, names |
| L4 | Welcome | `sections/Welcome.tsx` | ✅ | ✅ | Bismillah, parents, QS Yasin 36 |
| L5 | Countdown | `sections/Countdown.tsx` | ✅ | ✅ | WIB-anchored; see §9 for overseas guests |
| L6 | Story ×6 | `sections/Story.tsx` | ✅ | ✅ | Unchanged by variant |
| — | Divider | `ui/DraperyDivider.tsx` | ✅ | ✅ | |
| L7 | Japan | `sections/Japan.tsx` | ✅ | ✅ | |
| **L8** | **Event / Watch** | `EventDetails.tsx` / **`Watch.tsx`** | Address, map, dress code, notes, livestream row | **Cara Menyaksikan**: floral arch holding the date, four channel pills, timezone note, calendar CTA | **The only structural fork in the app** |
| — | Divider | | ✅ | ✅ | |
| L9 | RSVP | `sections/Rsvp.tsx` | Attendance + party size (capped by `party_max`) | "Konfirmasi Menyaksikan", no party size | Same component, two shapes |
| L10 | Wishes | `sections/Wishes.tsx` | ✅ | ✅ | Public wall; posts `slug` so the wish links to the guest |
| L11 | FAQ | `sections/GiftFaq.tsx` | `copy.faq` | `copy.faqOnline` | Parking and dress code are meaningless to a remote guest |
| L12 | Closing | `sections/Closing.tsx` | "Sampai bertemu di Bandung" | "Sampai bertemu di siaran langsung" | |
| — | Music toggle, sticky RSVP pill, scroll progress | `ui/*` | ✅ | ✅ | |

Both variants therefore run **twelve sections**. The online guest loses nothing countable.

`Watch.tsx` keeps `id="event"`, so anchors, the sticky-pill quiet-zone observer, and any
`#event` link behave identically in both variants. Do not rename it.

---

## 4. Livestream handling

The links do not exist yet and will be announced late, possibly the day before. The design
already absorbs that:

- `siteConfig.livestream` has four empty strings. Empty renders an **inert pill** through
  `components/ui/Cta.tsx` (`pending` prop) — the row keeps its shape rather than collapsing
  and then reappearing.
- When every channel is empty, `copy.watch.pending` appears: *"Tautannya menyusul, ya. Kami
  kirimkan lewat WhatsApp begitu siap."* That is a promise; keep it true (04 §7).
- `/live` exists precisely so **already-sent messages never go stale**. Messages point at
  `/live` or at the invitation, never at a raw YouTube URL.
- `calendarUrl({ online: true })` puts the YouTube link in the calendar entry once it exists,
  and "Siaran langsung (tautan menyusul)" before that. It must never put the Widuri address
  in an online guest's calendar.

**Task V1 (P1, M4):** as each URL arrives, paste it into `lib/config.ts` and deploy. Four
one-line changes, no logic. Verify `/live` and one online invitation afterwards.

---

## 5. Copy canon

`lib/copy.ts` is the only place a guest-facing string may live. Its header states the voice
rules; they are worth restating because new copy must obey them: plain sentences, concrete
over lyrical, the em dash rationed to about one per page, no "bukan X tapi Y", no three-item
lists used for rhythm, first person plural throughout.

### 5.1 Status of every block

| Block | Mirrored in `relevant/10-docs/03-copywriting.md`? | Status |
|---|---|---|
| `loading`, `gate`, `hero`, `welcome`, `countdown`, `story`, `event`, `rsvp`, `wishes`, `faq`, `closing.lines/emphasis` | Yes — **LOCKED** | Do not touch |
| `closing.emphasisOnline` | Yes — **LOCKED** | Do not touch |
| `watch` (heading, lead, dayLine, dateLine, timeLine, timezoneNote, pending, ctaCalendar) | Yes — **LOCKED** | Do not touch |
| `rsvpOnline` (heading, pill, lead, attendance, options, success) | Yes — **LOCKED** | Do not touch |
| `faqOnline` (4 items) | Yes — **LOCKED** | Do not touch |
| `a11y.watch` | Yes — **LOCKED** | Do not touch |
| Six WhatsApp templates in `lib/waTemplates.ts` | Yes — **LOCKED** | Do not touch — 04 §3 |

**Task C1 (P1, before M2):** read the new blocks aloud, edit anything that does not sound
like the couple, then mirror the final text into `relevant/10-docs/03-copywriting.md` and
mark it LOCKED. Copy that has been sent to 200 people cannot be revised.

### 5.2 Copy review checklist for the online blocks

- [ ] No sentence names Bandung, Widuri, an address, or a dress code.
- [ ] No sentence explains why the reader is not attending in person.
- [ ] No sentence implies a second, better invitation exists.
- [ ] Every promise is one the couple will keep ("kami kirimkan begitu siap").
- [ ] The reader is given three things to do: watch, confirm, write a doa.
- [ ] Register matches the group the template targets (formal for family, warm for friends).

---

## 6. Motion

Unchanged law: values from `lib/motionTokens.ts`, ownership split across Motion / GSAP /
fal.ai videos / CSS, `useMotion().tier` consulted by everything.

`Watch.tsx` uses only `Reveal`, which is the correct minimum: it is a practical section, and
the arch already carries the visual interest. Do not add parallax to it.

Tier behaviour to re-verify before freeze (05 §7):

| Tier | Trigger | Expected |
|---|---|---|
| `REDUCED` | `prefers-reduced-motion` | Gate appears instantly, no GSAP timelines, Ken Burns off |
| `LOW` | `saveData` or 2g/3g | Poster instead of hero video, no parallax |
| `MID` | < 4 GB RAM or ≤ 4 cores | Full motion, reduced particle budget |
| `HIGH` | everything else | Full budget |

---

## 7. Accessibility

Standing rules already met: `lang="id"`, visible `:focus-visible` rings in `globals.css`,
`aria-label` on every section and icon-only button, honeypot hidden from assistive tech,
`aria-live="polite"` on form results.

**Open items:**

| # | Item | Priority |
|---|---|---|
| A1 | Contrast check of the arch overlay text in `Watch.tsx` — dark ink over pale watercolour, but the artwork is not a flat field. Sample the darkest text pixel against the lightest background pixel inside the arch. | **P1** |
| A2 | The inert `pending` pill in `Cta.tsx` uses `aria-disabled` on a `<span>`; confirm a screen reader announces it as unavailable rather than skipping it silently. | P2 |
| A3 | Dashboard tap targets: filter `<select>`s are `min-h-[44px]`, buttons are `min-h-[44px]`, checkbox is 20 px — enlarge the checkbox hit area to 44 px via its label padding. | P2 |
| A4 | Colour is not the only signal for invite type in the dashboard chips — they already carry text. Verify after any restyle. | P3 |
| A5 | Test one full pass with VoiceOver on iOS, gate → RSVP submit. | P2 |

---

## 8. Performance

Budgets (from the project's own build notes, unchanged): hero LCP < 2.5 s on 3G, first-screen
transfer < 800 KB, Lighthouse mobile ≥ 90.

**New cost introduced by the guest system:** `/undangan/[slug]` is `force-dynamic` and does a
Supabase round trip before the first byte. From Southeast Asia to a Singapore-region project
that is roughly 30–80 ms; from elsewhere, more. Acceptable, and the alternative (caching guest
rows) trades away edit-immediacy for milliseconds.

If it ever needs optimising, the order is:

1. Keep the connection warm (`/api/health` ping, 02 §7.1) — removes cold-start cost.
2. Cache the slug→guest lookup in module memory for 30 s. 200 guests is a trivial map, and a
   30 s staleness window is invisible to a guest but noticeable to an editor, so make it
   explicit if adopted.
3. Only then consider ISR per slug.

**Checks before freeze:**

- [ ] `next build` shows `/` and `/live` as static (`○`), `/undangan/[slug]` and `/dashboard`
      as dynamic (`ƒ`). A route silently flipping to dynamic is a regression.
- [ ] Hero video still `preload`-managed by `useVideoLayer`, paused off-screen.
- [ ] No new `unoptimized` images beyond the two documented line-art cases.
- [ ] Lighthouse mobile run against production, one venue link and one online link.

---

## 9. Share preview, SEO, and timezone

**WhatsApp preview.** The card comes from the root `metadata` in `app/layout.tsx`: title
"Hanifah & Bashara — 22 Agustus 2026", description, and `hero-main.webp` as the OG image.
Every guest link therefore previews identically, which is correct — a preview card is
rendered in a chat other people can see, so it must not leak the recipient's name or which
variant they got.

**Decision (locked):** do **not** add per-guest `generateMetadata`. It would cost a second
database query per open and put a guest's name into a screenshot-able card for no benefit.

**`robots: { index: false, follow: false }`** is set site-wide in the layout, which also
covers `/dashboard` and `/undangan/*`. Keep it. This site should never appear in a search
result.

**Timezone.** Everything is stated in WIB and says so (`copy.watch.timezoneNote`). The
countdown derives from `siteConfig.event.startIso`, which carries `+07:00`, so it is correct
in every timezone automatically. Guests in Japan see the correct remaining time and a clearly
labelled WIB start. No per-locale rendering — a wedding has one start moment, and naming it
once in one timezone is clearer than converting it.

---

## 10. Open decisions owned by this document

### O2 — the gift section (D8)

Requested by the couple; conflicts with an earlier locked decision recorded in
`GiftFaq.tsx`: *"Tanda Kasih / gift block intentionally omitted — presence and prayers are
enough; we do not solicit transfers or gifts."* The bank fields in `siteConfig.bank` are also
still empty.

**Recommendation:** build it *data-gated*, so it is invisible until the couple deliberately
fills in an account. That honours both the old decision (nothing solicited by default) and
the new request (online guests who want to send something can).

Shape if approved:

- `components/sections/Gift.tsx`, rendered between Wishes and FAQ in both variants.
- Renders **nothing** unless at least one of `siteConfig.bank.id.accountNumber`,
  `.jp.accountNumber`, or `.giftAddress` is non-empty.
- Copy to be written and signed off with C1: a heading, one line making clear it is optional,
  and a copy-to-clipboard account number. No countdown, no nudge, no "wishlist".

**Exit:** couple says yes or no. Default if silent: not built.

### O4 — life after the wedding

Options: take it down; keep it up unchanged; or freeze it into a memento (remove RSVP and
the dashboard, keep the story, the wishes wall, and the photos). Recommendation: memento,
12 months, dashboard removed, `DASHBOARD_PASSPHRASE` unset. Decide in M7.

---

## 11. Task list for this document

| # | Task | Priority | Exit criterion |
|---|---|---|---|
| C1 | Sign off the new copy, mirror into `03-copywriting.md`, mark LOCKED | **P1** | Doc updated before the first send |
| A1 | Contrast sample of the arch overlay | **P1** | ≥ 4.5:1 for body, ≥ 3:1 for the display line |
| V1 | Paste livestream URLs into `lib/config.ts` as they arrive | P1 | `/live` shows live pills, calendar entry points at YouTube |
| P1 | Lighthouse + budget check on production, both variants | P1 | LCP < 2.5 s, transfer < 800 KB |
| A5 | VoiceOver pass, gate → RSVP | P2 | No unlabelled control, no trap |
| O2 | Gift section decision, then build or close | P2 | Built data-gated, or recorded as "not doing" |
| A3 | 44 px hit area for the dashboard checkbox | P2 | Measured in devtools |
| A2 | Screen-reader behaviour of inert pills | P3 | Announced, not skipped |

## 12. Implementation update — 2026-07-29

C1 is complete: all online blocks and six WhatsApp templates are mirrored and marked LOCKED in `relevant/10-docs/03-copywriting.md`. O2 uses its default and is **DECIDED — NOT DOING**. `Cta` now uses a native disabled button for pending channels, the dashboard checkbox label has a 44 px padded hit area, and the Watch arch copy sits on an opaque paper backing for stable contrast.

V1, production Lighthouse, VoiceOver/device checks, and final contrast measurement remain external/manual gates because the livestream URLs and production deployment are not available in the repository.
