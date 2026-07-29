# 04 — The Dashboard and the Delivery Operation

**Owns:** everything at `/dashboard`, the WhatsApp templates, and the human operation of
getting ~200 invitations out and ~200 answers back.
**Does not own:** schema and endpoints (02), what the guest sees (03), deployment (05).

This document has two halves. §§1–5 are software. §§6–9 are an operations runbook, and they
matter more, because the software is finished and the sending is not.

---

## 1. What exists today

`/dashboard` — passphrase gate → single-screen guest manager, Indonesian, mobile-first cards
rather than a table, because the WhatsApp button is tapped from a phone.

**Header:** four live counts — total, sudah diundang, membuka, konfirmasi — plus sign-out.

**Controls:** free-text search across name, slug, WhatsApp name, phone and notes; three
filters (kelompok, jenis undangan, status); "Tambah tamu".

**Per guest card:** display name, party label, slug; chips for group, invite type, phone,
open count, RSVP status and party size; the guest's note if they left one; the couple's
private note. Actions: **Kirim WhatsApp**, **Salin link**, **Salin teks**, **Lihat**,
**Ubah**, **Hapus**, and the **Sudah diundang** checkbox.

**Form:** display name (with honorific, typed by the couple), slug (+ "Dari nama"), WhatsApp
nickname, phone (with live normalised echo), group, invite type, party label (+ "Keluarga"
shortcut), `party_max`, the message template, and private notes.

Two behaviours in the form are deliberate and easy to break in a refactor:

1. **Changing group or invite type rewrites the message only if it was still the untouched
   template.** An edited message survives a group change.
2. **A message identical to the template is saved as `null`**, not as a copy. The guest keeps
   following the template, so a later template fix reaches them.

---

## 2. Guest lifecycle

```
   created ──► invited ──► opened ──► answered
      │           │           │           │
   row exists  invited_at  confirmed   rsvps row
               stamped     open (02§5)  linked
```

| State | Set by | Shown as | Reliable? |
|---|---|---|---|
| created | Saving the form | Card exists | Yes |
| invited | The couple ticking "Sudah diundang" | Checkbox | Yes — it is a human assertion, which is the honest model given `wa.me` cannot report delivery |
| opened | Page render today; gate tap after 02 §5 lands | "Dibuka N×" | **Not yet** — currently inflated by link-preview crawlers |
| answered | `POST /api/rsvp` with a resolving slug | Status chip + party count | Yes |

**Read "opened" carefully.** Until task B3 ships, a message that was merely *sent* can show
"dibuka 1×", because WhatsApp fetches the URL to build its preview card. Do not conclude
anything social from that number before then, and do not send anyone a "we saw you opened
it" message. Ever.

---

## 3. The message templates

Six starters in `lib/waTemplates.ts`, keyed `${invite_type}:${guest_group}`.

| Key | Register | Speaks as |
|---|---|---|
| `venue:groom_family` | Formal, salam + wassalam | "saya Bashara bersama Hanifah" |
| `venue:bride_family` | Formal | "saya Hanifah bersama Bashara" |
| `venue:friend` | Warm, informal | "kami" |
| `online:groom_family` | Formal | "saya Bashara bersama Hanifah" |
| `online:bride_family` | Formal | "saya Hanifah bersama Bashara" |
| `online:friend` | Warm, informal | "kami" |

The family split is not decoration: a message from the person that side of the family
actually knows reads as a personal note rather than a broadcast — which is also, usefully,
the opposite of what spam heuristics look for (§6.2).

**Placeholders:** `{nama}` → `whatsapp_name` if set, else `display_name`; `{link}` →
`https://<site>/undangan/<slug>`; `{tanggal}` → `siteConfig.event.dateLabel`.

**Why the box holds the template and not the final text:** if the resolved message were
stored, a later name correction or slug change would leave a stale name and a dead link
frozen in the override. Placeholders keep an edited message correct forever.

The online templates carry the same constraint as the online invitation (03 §1): no venue,
no reason, no comparison. **Review them under 03 §5.2's checklist before the first send.**

---

## 4. QuickAdd — the missing piece (D6) — **P1, before M3**

Typing ~190 guests through a twelve-field form is somewhere between four and eight hours of
work, and the failure mode is not slowness but abandonment at guest 60.

**Design.** A collapsible panel above the list: one textarea, one line per guest, plus
defaults for the whole batch (group, invite type, `party_max`, party label).

```
Bapak Achmad Fuad Bay & Keluarga | bapak-fuad | 08123456789 | Beserta Keluarga
Tante Rina                       | tante-rina | +6281234567891
Dimas                            |            | 08987654321
```

Rules:
- Fields separated by `|`. Only the first is required.
- Missing slug → `slugify(display_name)`, shown in the preview before anything is saved.
- Batch defaults fill group, invite type, `party_max`, party label.
- **Preview table first**, with per-row validation errors (bad phone, duplicate slug,
  slug already taken) and a "Simpan N tamu" button that is disabled while any row is invalid.
- Saving posts rows sequentially to the existing `POST /api/dashboard/guests` — no new
  endpoint, no transaction semantics to reason about. Report per-row success or failure.
- After saving, the panel keeps failed rows so they can be fixed and retried.

**Exit criterion:** 50 guests pasted from a phone contact export, previewed, corrected, and
saved in under ten minutes, with zero duplicate slugs created.

---

## 5. Other dashboard work

| # | Task | Priority | Exit criterion |
|---|---|---|---|
| G1 | QuickAdd (§4) | **P1** | Above |
| G2 | "Unduh CSV" button wired to `/api/dashboard/export` (02 §7.2) | P1 | Three files downloaded |
| G3 | Show *confirmed* opens once 02 §5 lands; demote the raw count to a tooltip | P1 | A sent-but-unopened invitation reads "belum dibuka" |
| G4 | Sort control: newest, name A→Z, **belum diundang first** | P2 | Sorting persists while filtering |
| G5 | "Belum dibalas" quick filter combining invited + no RSVP | P2 | One tap produces the reminder list |
| G6 | Read the `latest_rsvps` view (02 §4b) | P2 | A double-answering guest shows one status |
| G7 | Wishes moderation panel (`hidden` flag) | P2 | A wish can be hidden in two taps |
| G8 | Duplicate-phone warning on save | P3 | Saving a number already on another guest warns but permits |
| G9 | Per-guest "kirim ulang" note field for the reminder pass | P3 | Optional |

Explicitly **not** doing: bulk send (impossible with `wa.me` and undesirable anyway), guest
self-service editing, seat/table assignment, printed-invitation export.

---

## 6. The send operation

### 6.1 Sequencing

Send in this order, and finish each stage before starting the next.

| Stage | Who | When | Count | Why this order |
|---|---|---|---|---|
| Pilot | 10 mixed guests, people who will tell you if something is odd | 3 Aug (D-19) | 10 | Catches a wrong honorific or a broken link while it is still cheap |
| Wave 1 | Both families, venue | 4–5 Aug | ~80 | Elders first, and they generate the most questions |
| Wave 2 | Friends, venue | 6–7 Aug | ~70 | |
| Wave 3 | All online guests | 7–8 Aug | ~40 | Last, because these are the messages most likely to need the `/live` promise honoured |

Rationale for finishing by 8 August: RSVP closes 15 August. A guest needs a week to answer,
and older relatives may need someone to help them open the link.

### 6.2 Pacing, and why it matters (R2)

Sending ~200 messages from a personal WhatsApp account in one sitting is a recognised spam
pattern. An account restriction mid-send would be a genuine disaster, so:

- **≈ 25 messages per hour, ~60 per day per account.** Two people sending halves this in
  wall-clock time.
- **Bashara sends to his family, Hanifah to hers.** The templates already speak in the right
  voice, and messages to existing contacts who reply are the least suspicious pattern there is.
- **Do not paste the same text 200 times.** The six templates plus per-guest names already
  vary the body; leave it that way.
- Prefer numbers already in the phone's contacts.
- If WhatsApp shows any warning, **stop for 24 hours** and resume at half the rate.
- Never send in the middle of the night; replies keep the account looking human.

### 6.3 The per-guest loop

1. Filter to **Belum diundang** within the current wave.
2. Read the resolved message on the card. Does the honorific look right for this person?
3. Tap **Kirim WhatsApp** → WhatsApp opens with the text prefilled → **read it once more** →
   send.
4. Return to the dashboard and tick **Sudah diundang**.
5. For a guest you will reach another way (Instagram DM, SMS, in person), use **Salin teks**
   and **Salin link**, then still tick the box.

Step 4 is the one that gets skipped when tired. The checkbox is the only record that exists;
`wa.me` cannot tell the app anything.

### 6.4 Guests without a phone number

Leave `phone` empty. The card shows "Nomor belum diisi" and the WhatsApp button is inert, but
**Salin link** and **Salin teks** still work — that is the intended path for Instagram DMs
and for handing someone a link in person.

---

## 7. Between sending and the wedding

| When | Action | Owner |
|---|---|---|
| Daily, 4–15 Aug | Skim new RSVPs and wishes; answer questions | Both |
| As they arrive | Paste livestream URLs into `lib/config.ts`, deploy (03 §4) | Bashara |
| Immediately after that deploy | **Message every online guest**: the links they were promised are live | Both |
| 12 Aug (D-10) | First reminder to invited-but-unanswered | Both |
| 14 Aug (D-8) | Second reminder, personal, short | Both |
| 15 Aug (D-7) | RSVP deadline. Export all three CSVs | Bashara |
| 16–21 Aug | Late replies handled by hand, not by reopening anything | Both |

Reminder tone: one short line, no guilt, and never a reference to open tracking.

> Assalamualaikum, {nama}. Undangan kami sudah dikirim minggu lalu, ya. Kalau sudah tahu bisa
> datang atau tidak, boleh dikabari lewat tautan ini: {link}. Terima kasih!

### 7.1 Common situations

| Situation | What to do |
|---|---|
| "Linknya tidak bisa dibuka" | Ask them to paste what they see. A truncated link lands on the generic invitation, so they are not stuck — resend with **Salin link**. |
| Guest forwarded their venue link to a friend | The friend sees the venue. Nothing is broken technically; decide socially whether to add them as a guest. |
| Someone asks why they got the livestream version | Answer as people, not as the site. The invitation never raises the question; do not let the answer come from a screen. |
| A guest RSVPs twice with different answers | The dashboard shows the latest (02 §4b). Confirm by message if it matters. |
| Wrong honorific spotted after sending | Fix `display_name` in the dashboard; the invitation page updates immediately. The already-sent message keeps the old greeting — send a short correction if it is a relative. |
| A name changes after sending | Change the name freely; **never change the slug** (01 §6 R4). |
| Someone asks for the address who has the online invitation | This is a decision, not a bug. Either change their `invite_type` to `venue` (their existing link then shows the venue immediately) or explain warmly. |

---

## 8. Security and privacy of the dashboard

- One shared passphrase; rotate it before M1 and again after the wedding (05 §4). The
  current value has been typed into chat logs.
- The dashboard is `noindex` via the site-wide robots setting, but obscurity is not the
  control — the cookie is.
- **The list holds ~200 phone numbers.** Do not screenshot the dashboard into group chats,
  and do not commit an export.
- Sign out on any shared or borrowed device. The session lasts 30 days.
- `notes` is private, but write it as if someone might read it over your shoulder.

---

## 9. Definition of done for this document

- [ ] QuickAdd exists and 190 guests were entered with it.
- [ ] Every guest row has `invited_at` set by 8 August.
- [ ] Every guest either has a phone number or a recorded alternative channel.
- [ ] Confirmed-open tracking is live and the raw count is demoted.
- [ ] CSV export exists and has been run on 15, 21 and 23 August.
- [ ] Reminder passes sent on 12 and 14 August.
- [ ] Livestream links pasted and every online guest told.
- [ ] Passphrase rotated before the first login from production.

## 10. Implementation update — 2026-07-29

G1–G9 are implemented. QuickAdd validates and previews batches, saves sequentially, preserves failures, and warns without blocking duplicate phones. CSV export, confirmed-open state, sorting, the one-tap unanswered filter, latest-RSVP reads, two-tap wishes moderation, structured alternative channels, and reminder notes are present end to end.

The dated send waves, WhatsApp pacing, manual `invited_at` assertions, reminders, exports, livestream notification, and passphrase rotation remain operator work and cannot be truthfully checked before those dates.
