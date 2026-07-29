# 01 — Project Brief
## "Buka Buku": A Living Storybook Wedding Invitation

**For Google Stitch designers.** This document defines what we are building, for whom, and what success feels like. Design and UX intent only — no implementation detail.

---

## What This Is

A **mobile-first digital wedding invitation** for the marriage of **Bashara Aina** and **Hanifah Syifa Azzahra Bay** on **22 August 2026** at Widuri Restaurant, Bandung, Indonesia.

The guest should not feel like they are opening a website. They should feel like they are opening a **personal handwritten invitation** — then stepping into a warm, illustrated world that tells a love story.

---

## The Emotional Arc

```
Ritual opening → Enter a living storybook world → Scroll through a love story → Feel warm → RSVP with joy
```

Total journey time: approximately **one minute** of unhurried scrolling. The experience is one continuous page — no visible navigation bar, no chapters labeled as chapters. Just a world that unfolds as the guest moves through it, like turning pages in a picture book.

---

## Three Words That Govern Every Design Decision

**Intimate · Romantis · Playful (kucing/cats)**

| Word | Meaning in practice |
|------|---------------------|
| **Intimate** | Every screen feels made for this one guest. Personal, warm, never corporate. |
| **Romantis** | Storybook fairytale — but grounded. Morning sunshine. Soft drapery. Not a ballroom, not a fairy castle. |
| **Playful (cats)** | The couple's seven cats are part of the love story, not decoration. Each has a name and personality. |

---

## Who This Is For

Wedding guests of Bashara & Hanifah — mostly Indonesian family and close friends, with some international guests.

- Most will open this on a **phone**, over mobile data.
- Some arrive via a **personal link** that greets them by name.
- A few will never attend in person; the invitation is their only way to participate.
- Emotional context: **warmth, curiosity, light anticipation** — they are here to celebrate people they love, not to be impressed by design.

---

## What the Invitation Must Do

1. Tell the couple's love story briefly and beautifully
2. Communicate the date, venue, and dress code clearly
3. Collect an RSVP per guest without friction
4. Host a public wishes wall where guests can leave messages
5. Share gift information gracefully (never transactionally)
6. Leave a lasting impression that mirrors the warmth of the wedding itself

---

## Brand Personality

**Storybook fairytale, warm-morning edition.**

- **Reference sentence:** A single-page invitation that opens like a picture book, with flowing white drapery, asymmetrical florals, arch-shaped frames, and seven cats tucked into the love story. Mobile portrait first. Late summer morning light, soft and unhurried.
- **Color feel:** Ivory and blush carry the page. Sage green for botanical touches. Soft peach as the warm morning light.
- **Voice:** Indonesian is the heart language. English appears only where it lifts the romance (hero headline, couple names on gate).
- **The cats** are beloved characters in a love story — each has a name and personality.

---

## The Master Visual Anchor

**`stitch/hero-main.png`** is the design north star.

Everything — palette, light, characters, the seven cats, every section, every generated illustration — must conform to this image. When anything is ambiguous, **the master wins**.

The hero illustration shows:
- **Hanifah** (bride, cream/ivory hijab, left) holding **Moju** with **Shiro** on her shoulder
- **Bashara** (groom, deep navy, right) holding **Jiro** with **Meng** on his shoulder
- **Simba**, **Hoshi**, and **Kimho** in the foreground grass
- Doves and butterflies above; wildflowers in blush, white, yellow, and lavender on spring-green meadow
- Soft morning light throughout

Dimensions: 1080 × 1350 px (portrait). Whimsical illustrated style — soft watercolor-adjacent, warm colors, recognizable faces.

---

## The Opening Gate (Critical Design Decision)

The gate is **not an envelope**. It is the **cover of a storybook** — a precious illustrated page with a floral border frame, ivory paper, and the guest's name at center.

On tap **"Buka Undangan"**:
1. **La Vie en Rose** begins fading in (low volume, loop)
2. The gate page dissolves
3. The hero illustration assembles (1.4–1.8 seconds)

This is a ritual, not a loading screen. The guest should feel they are opening a book.

---

## Anti-References (What This Must NEVER Look Like)

- Generic Indonesian wedding templates — gold filigree, ribbon banners, glittery cursors, formal "Kepada Yth." envelopes
- Bold fuchsia or hot-pink palettes. Glitter. Excessive ornament.
- The "AI wedding site" tell: cream-on-cream minimalism with italic drop caps and no color
- SaaS landing-page grammar — numbered eyebrows, identical card grids, gradient text
- Transactional gift sections with pushy CTAs
- Motion or visual effects that exist only to show off
- Heavy, dark, dramatic — this is **morning light**, not candlelight dinner

---

## The Couple's Cats (Characters, Not Decoration)

| Name | Reference in `stitch/` | Hero placement |
|------|------------------------|----------------|
| Shiro | `cat-white-closeup-pink-ears-name-shiro.png` | On Hanifah's shoulder |
| Moju | `cat-ragdoll-portrait-name-moju.png` | Held by Hanifah |
| Simba | `cat-orange-white-on-couch-name-simba.png` | Foreground grass, center-left |
| Meng | `cat-black-white-lying-bw-name-meng.jpg` | On Bashara's shoulder |
| Kimho | `cat-kimho-portrait.png` | Foreground grass, center-right |
| Jiro | `cat-black-white-pendant-name-jiro.jpg` | Held by Bashara |
| Hoshi | `cat-gray-tabby-in-blankets-name-hoshi.png` | Foreground grass, peeking |

All seven cats appear in the hero. They reappear in the closing section as an emotional echo.

---

## Design Principles

1. **Personal over performative.** Every section should make a guest feel invited into a relationship, not impressed by design.
2. **Storybook pacing, mobile first.** Phone portrait is the primary canvas. One emotional beat per fold.
3. **Illustration carries the world; photographs carry the people.** Stylized illustrations set the mood. Real photographs appear in scrapbook gallery moments within story and event context — harmonized to palette but never distorted.
4. **Motion breathes the page.** Music, gentle parallax, and ambient life cooperate — nothing animates just because it can. Every motion has a calm, reduced alternative. Motion philosophy: **"hidup bukan kaku"** — life is not rigid; everything has a gentle, organic quality.
5. **One language of voice.** Indonesian is the heart; English only where it lifts the romance. No mixing inside the same sentence.

---

## Success Criteria (Design Perspective)

A guest opens the link on their phone → **smiles within five seconds** → understands the essentials without scrolling endlessly → submits RSVP without friction → remembers the day warmly.

That is the standard.

---

## Document Map (this folder)

| File | Purpose |
|------|---------|
| `01-PROJECT-BRIEF.md` | This file — intent, audience, anti-references |
| `02-VISUAL-LANGUAGE.md` | Color, type, aesthetic direction |
| `03-SECTIONS-AND-FLOW.md` | Full section order and content hierarchy |
| `04-USER-JOURNEY-AND-GATE.md` | Guest journey, gate ritual, personalization |
| `05-COPY-AND-TONE.md` | Locked copy, voice rules, all section text |
| `06-DESIGN-SYSTEM.md` | Tokens, components, states |
| `07-MOTION-AND-CHOREOGRAPHY.md` | Motion principles, hero assemble, section reveals |
| `08-MICROINTERACTIONS-AND-A11Y.md` | Touch feedback, forms, accessibility |
| `09-ASSET-INVENTORY.md` | `stitch/` images mapped to sections |
| `10-STITCH-PROMPTS-AND-SCREEN-BRIEFS.md` | Screen-by-screen Google Stitch briefs |
