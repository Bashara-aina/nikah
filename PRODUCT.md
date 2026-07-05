# Product

## Register

brand

## Users

Wedding guests of Bashara & Hanifah, mostly family and close friends, with a mixed Indonesian + international split. Most will open the invitation on a phone over mobile data, often weeks before the wedding and again on the day itself. Some will arrive via a personal link that pre-fills their name. A smaller group will revisit the site to find the venue, RSVP, send wishes, or look up the gift information. A few will never come in person and the site is the only way they get to participate.

Emotional context: warmth, curiosity, a touch of anticipation. They are here to celebrate a relationship they care about, not to evaluate a product.

## Product Purpose

A single-page digital wedding invitation for the 22 August 2026 ceremony of Bashara Aina and Hanifah Syifa Azzahra Bay. The site replaces a printed invitation and a save-the-date. It needs to (1) tell the couple's story briefly, (2) communicate the date, venue, and dress code, (3) collect an RSVP per guest, (4) host a public wishes wall and a private gift section, and (5) leave a lasting impression that mirrors the wedding's atmosphere.

Success looks like every invited guest opening the link, smiling within five seconds, understanding the essentials without scrolling forever, submitting an RSVP without friction, and remembering the day afterwards.

## Brand Personality

Three words: **intimate · romantis · playful (kucing)**. Warmth first, sentimentality never. Voice is Indonesian primary with English where it feels natural — global-modern in presentation, Indonesian in ethics. Storybook fairytale but grounded; morning sunshine and soft drapery, not glitter or ballroom excess. The cats are part of the love story, not decoration.

## Anti-references

- Generic Indonesian wedding invitation templates — gold filigree, ribbon banners, "Kepada Yth." envelopes, glittery cursors.
- Bold fuchsia or hot-pink palettes. Glitter. Excessive ornament.
- The "AI wedding site" tell: cream-on-cream minimalism with Fraunces headlines and italic drop caps.
- Transactional or guilt-tripping gift sections. The gift section is grateful, not pushy.
- SaaS landing-page grammar (numbered eyebrows, identical card grids, gradient text) ported into a wedding context.
- Heroic overproduction: any motion that exists only to show off. Motion must breathe the page, not perform.
- Making the real couple and cat photos into video. Identity must stay intact; motion is layered on top of stylized illustrations only.

## Design Principles

1. **Personal over performative.** This site exists because two people are getting married; every section should make a guest feel invited into that, not impressed by the design.
2. **Storybook pacing, mobile first.** Phone portrait is the primary canvas. Scrolling is the journey. One emotional beat per fold.
3. **Illustration carries the world; photographs carry the people.** AI-stylized illustrations set the mood. Real photographs of the couple and the cats appear only once — handled with care, harmonized to palette but never distorted.
4. **Motion is the third medium, not the first.** Music, parallax, GSAP choreography, and fal.ai video loops cooperate; nothing animates just because it can. Every motion has a reduced-motion fallback.
5. **Calm load under bad conditions.** Slow networks and low-end phones are first-class. Videos pause off-screen, posters are always available, the page is fully usable with motion disabled.
6. **One language of voice across sections.** Indonesian is the heart; English only where it lifts the romance. No mixing inside the same sentence.

## Accessibility & Inclusion

- WCAG 2.2 AA target. Body text ≥ 4.5:1, large text ≥ 3:1 against its actual background.
- Every video and CSS animation respects `prefers-reduced-motion: reduce` with a static or crossfade fallback. No essential content is gated on motion completion.
- Personal links carry the guest's name in the URL and pre-fill the greeting; no client-side PII storage beyond what the URL provides.
- RSVP and wishes are submitted through Google Sheets via Apps Script; rate-limited and validated server-side to prevent spam.
- All interactive elements (gate button, RSVP form, wishes form) have ≥ 44×44px touch targets and visible focus states.
- Bahasa Indonesia content is reviewed for inclusive language (no assumptions about religion beyond the Surah Yasin verse that is explicitly the couple's choice).
- Color is never the only signal: countdown, RSVP state, and form errors all carry text and iconography alongside color.