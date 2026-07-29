# 04 — User Journey & Gate
## How a Guest Moves Through the Invitation

**For Google Stitch designers.** This document maps the guest experience from first tap to RSVP — emotional beats, personalization, and the gate ritual.

---

## Journey Overview

```
Link tap → Loading (1–2s) → Gate (storybook cover) → Tap "Buka Undangan"
    → Music fades in → Hero assembles (1.4–1.8s) → Scroll through story
    → RSVP → Wishes → Gift → Closing
```

**Total time to smile:** ≤ 5 seconds (gate + hero)
**Total scroll time:** ~1 minute unhurried

---

## Entry Paths

### Personal Link (Primary)
Guest arrives via a unique URL containing their name.

- Gate displays: **Kepada yang terkasih, {namaTamu}**
- Name is the emotional anchor — large, centered, Cormorant Garamond or script accent
- RSVP form pre-fills name field (editable)

### Generic Link (Fallback)
Guest arrives via a shared link without personalization.

- Gate displays: **Kepada yang terkasih** (no name)
- RSVP form shows empty name field
- All other experience identical

---

## Phase 1: Loading (0–2 seconds)

**Emotional beat:** Anticipation. A breath before the book opens.

| Element | Design |
|---------|--------|
| Visual | Sleeping cat in floral wreath — small, centered, quiet |
| Text | `#BASHicallyHANI's` in script accent |
| Background | Ivory `#FBF7F0` |
| Duration | 1–2 seconds max, then auto-advance |
| Interaction | None — no tap, no spinner, no progress bar |

**What the guest feels:** "Something beautiful is about to happen."

---

## Phase 2: The Gate — Storybook Cover

**Emotional beat:** Being personally invited. This is precious.

### What It Is

The gate is the **cover of a storybook** — an illustrated page with a floral border frame on ivory paper. It is **NOT**:
- An envelope (no flap, no wax seal, no "Kepada Yth.")
- A full-screen photograph
- A login screen or splash page

### Layout

```
┌─────────────────────────────┐
│  ╭─ floral border frame ─╮  │
│  │                       │  │
│  │   The Wedding of      │  │
│  │   Bashara & Hanifah   │  │
│  │                       │  │
│  │   Kepada yang         │  │
│  │   terkasih,           │  │
│  │   {namaTamu}          │  │
│  │                       │  │
│  │   Dengan penuh        │  │
│  │   syukur, kami...     │  │
│  │                       │  │
│  ╰───────────────────────╯  │
│                             │
│      [ Buka Undangan ]      │  ← thumb zone
└─────────────────────────────┘
```

### Visual Details

- **Background:** Ivory `#FBF7F0` — the paper of the book
- **Border frame:** Asymmetric florals on one side, sage and blush tones, arch-shaped inner edge
- **No cats** on the gate — they are the hero surprise
- **Guest name:** Largest text on screen after couple names. Cormorant Garamond, centered
- **CTA button:** Dusty pink pill, bottom third, min 48×48px touch target
- **Music toggle:** Visible but subtle, top corner (muted by default until gate opens)

### On Tap "Buka Undangan"

This is the single most important interaction in the entire invitation.

| Step | What happens | Duration |
|------|-------------|----------|
| 1 | Button gives tactile feedback (scale down, warm shadow) | 150ms |
| 2 | **La Vie en Rose** begins fading in — low volume, loop | 800ms fade |
| 3 | Gate page dissolves — opacity fade + gentle scale up | 600ms |
| 4 | Hero layers begin assembling (see 07-MOTION) | 1.4–1.8s |
| 5 | Hero text appears last — names, date, headline | 400ms after assemble |

**What the guest feels:** "I just opened something special. The world is coming alive."

---

## Phase 3: Hero → Scroll

**Emotional beat:** Wonder. Joy. The smile moment.

After hero assembles:
- Guest sees the full illustrated scene with all 7 cats
- Text overlays appear: "We are getting married" → names → date
- Sticky RSVP pill fades in (bottom-right)
- Guest begins natural scroll

**Scroll behavior:**
- No snap points, no forced pacing
- Sections reveal as guest scrolls — gentle, not jarring
- Drapery dividers mark section transitions (fabric flowing, not hard cuts)
- Music continues looping at low volume

---

## Phase 4: Story → Emotion → Practical

**Emotional arc through scroll:**

| Scroll depth | Section | Guest feeling |
|-------------|---------|---------------|
| 0–15% | Welcome + Countdown | Warmth, anticipation |
| 15–50% | Love Story (6 chapters) | Curiosity, connection, nostalgia |
| 50–55% | Japan Dream | Wonder, pride |
| 55–70% | Event Details | Practical clarity |
| 70–80% | RSVP | Agency, participation |
| 80–90% | Wishes + Gift | Generosity, gratitude |
| 90–100% | Closing | Full heart, bookmark moment |

---

## Phase 5: RSVP (Primary Goal)

**Emotional beat:** Sending a personal note back.

- Sticky RSVP button has been visible since hero — guest may have jumped here already
- Form feels like a handwritten reply card, not a web form
- On submit: warm confirmation message, not a generic "Success!"
- Button shows loading state during submission

---

## Phase 6: Closing (Emotional Full Stop)

**Emotional beat:** The book closes. A cat peeks from the bottom.

- Mirrors hero composition — couple + cats, illustrated
- Closing text: "Tak sabar bertemu denganmu di hari bahagia kami."
- Hashtag `#BASHicallyHANI's` in script accent
- No CTA — the journey is complete
- Music may continue or fade gently

---

## Personalization Map

| Element | Personal link | Generic link |
|---------|--------------|--------------|
| Gate name | `{namaTamu}` displayed | Omitted |
| RSVP name field | Pre-filled | Empty |
| Wishes name field | Pre-filled | Empty |
| All other content | Identical | Identical |

---

## Re-visit Behavior

Guests may return multiple times (check details, re-read wishes).

- Gate is **skipped** on return — guest lands directly on hero
- Music resumes from toggle state (not auto-play)
- RSVP shows previous submission if already confirmed
- Wishes wall shows all messages including their own

---

## Edge Cases (Design Responses)

| Scenario | Design response |
|----------|----------------|
| Slow connection | Loading holds max 2s, then gate. Hero layers load progressively — sky first, then meadow, then characters |
| Guest never taps gate | Gate waits indefinitely. No timeout, no skip button |
| Guest scrolls past RSVP | Sticky button remains until they reach RSVP section |
| Guest mutes music | Toggle persists. All motion continues (music-independent) |
| Reduced motion preference | Hero assemble becomes instant crossfade. All ambient motion stops. Content fully visible immediately |

---

## Success Metrics (Design)

| Metric | Target |
|--------|--------|
| Time to smile | ≤ 5 seconds from link tap |
| Gate tap rate | > 95% (gate must compel tap) |
| RSVP completion | > 80% of guests who scroll past event section |
| Return visits | Guests come back to read wishes — wall feels alive |
