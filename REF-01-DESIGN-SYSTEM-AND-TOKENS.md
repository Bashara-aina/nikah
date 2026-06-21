# REF 01 — DESIGN SYSTEM & TOKENS

> The visual foundation every component imports. **Derived from the master `nikah-web/scenes/hero-main.webp`.** Companion to the 5 guides; referenced by GUIDE 00.
> The scaffold already has a good base in `app/globals.css` (Tailwind v4 `@theme`, OKLCH) and `app/layout.tsx` (fonts). This file makes it **complete and authoritative** — it tells Cursor exactly what to keep, what to add, and the rules to design by.

---

## 0. The palette IS the master
Open `hero-main.webp` and sample it. The tokens below already exist in `app/globals.css` `@theme` — keep them, and **add the two missing storybook accents** (`dusty`, `peach`) that `DESIGN.md` names and the master shows in its wildflowers and warm light.

**Already in `globals.css` (keep as-is):** `--color-paper`, `--color-cream`, `--color-surface`, `--color-border`, `--color-ink`, `--color-muted`, `--color-blush`, `--color-sage`, `--color-gold`.

**Add to both the `@theme` block and the `:root` mirror:**
```css
--color-dusty: oklch(0.74 0.06 12);   /* dusty rose — secondary accent (master's deeper flowers) */
--color-peach: oklch(0.86 0.07 55);   /* soft peach — warmest highlight, use sparingly */
--color-navy:  oklch(0.34 0.04 255);  /* groom's attire — intentional anchor; for one-off emphasis only */
--color-sky:   oklch(0.93 0.03 230);  /* master's soft sky — optional section wash */
```
Rules: `--ink` is soft charcoal/taupe, **never pure black**. `--peach`/`--navy` are accents, never section surfaces. No fuchsia, no hot pink, no glitter gradients, no purple→blue gradients (`DESIGN.md` anti-rules). Body text must hit **≥ 4.5:1** on both `--paper` and `--cream` — verify `--ink` against each (it passes ≈7:1).

> Dark mode is out of scope. One controlled light theme (`color-scheme: light` already set).

## 1. Warm shadows (add these — never use gray/black shadows)
```css
--shadow-petal: 0 2px 8px  oklch(0.4 0.03 60 / 0.06);
--shadow-card:  0 4px 16px oklch(0.4 0.03 60 / 0.10);
--shadow-float: 0 12px 32px oklch(0.4 0.03 60 / 0.12);
```
Use `--shadow-float` for the gallery lift and floating buttons; `--shadow-card` for cards. (`docs/04`/`NIKAH-MASTER §4` warm-tint rule.)

## 2. Z-index — expose the existing scale as utilities
`globals.css` defines `--z-*` CSS vars (dropdown 50, sticky 100, modal-backdrop 200, modal 300, toast 400, tooltip 500), but `Gate.tsx` uses a `z-modal` **class** that Tailwind v4 won't emit by default. Add the scale to `@theme` so the utilities exist:
```css
/* in @theme */
--z-index-dropdown: 50;
--z-index-sticky: 100;
--z-index-modal-backdrop: 200;
--z-index-modal: 300;
--z-index-toast: 400;
--z-index-tooltip: 500;
```
Then `z-modal`, `z-sticky`, `z-toast` resolve. (Or replace the class usages with `z-[300]` — pick one and be consistent. Prefer the named scale.)

## 3. Typography
Fonts are already wired in `layout.tsx`: **Cormorant Garamond** (serif/display, `--font-serif`) + **Inter** (sans/body, `--font-sans`), self-hosted via `next/font`, zero layout shift.

> ### 🔀 DECISION — fonts
> `DESIGN.md` lists Cormorant and Inter on its *avoid* list (they're the "AI wedding" reflex), while `AGENTS.md` accepts the wired pairing. **For a one-shot build, keep Cormorant + Inter** — they're accessible, shipped, and read clean against the master. If you want more personality and have time, swap **one line in `layout.tsx`**: a higher-character display serif for the names/headlines (anything with a strong italic that isn't Playfair/Fraunces) while keeping Inter for body. Do not block the build on this.

Scale — fluid `clamp()`, hero ceiling ≤ 6rem, display letter-spacing floor ≥ -0.04em. `text-wrap: balance` on h1–h3 (already set), `text-wrap: pretty` on body (already set). Body line-height ≥ 1.6, line length 65–75ch. A script accent is allowed **only** for the couple's names + the hashtag `#BASHicallyHANI's` — never body, never nav.

```css
/* add to :root for fluid type if components want raw vars */
--text-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem);
--text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
--text-lg:   clamp(1.125rem, 1rem    + 0.75vw, 1.5rem);
--text-xl:   clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem);
--text-2xl:  clamp(2rem,     1.2rem  + 2.5vw,  3.5rem);
--text-hero: clamp(2.5rem,   1rem    + 5vw,    5rem);
```

## 4. Spacing & radius
Use Tailwind's scale (4px base) for rhythm; **tight within a section, generous between sections** (`DESIGN.md` Layout). Radius: cards `rounded-xl/2xl`, pills/buttons `rounded-full`, arch frames via `border-radius` top + `clip-path`. No nested cards, no identical card grids, no side-stripe accent borders.

## 5. Signature shape language (from the master + concept PDF)
These make it a storybook, not a SaaS page — build them as small reusable pieces:
- **Drapery dividers** between sections (white flowing cloth) — `florals/drapery-divider.png` with the CSS ripple keyframe. Not hard edges.
- **Asymmetrical floral framing** — one side only, never mirrored (`floral-corner-tl`/`-br` placed asymmetrically).
- **Arch frames** for image frames + the gate card + the event venue block (`arch-frame.png` or CSS `border-radius`/`clip-path`).
- **Scrapbook gallery** — scatter + slight per-photo rotation, never a uniform grid.
- One continuous **ivory canvas** (`--paper`) flowing top to bottom; sections alternate subtly with `--cream`, not boxed.

## 6. Motion tokens — already centralized, do not duplicate
**All** easing/duration/amplitude/stagger/spring come from `lib/motionTokens.ts` via `lib/motionAdapter.ts`. No magic numbers in components. Reduced-motion is centralized in `globals.css` (the `@media (prefers-reduced-motion)` block collapses CSS animations) + each library's own check. The `@keyframes sway` is already defined; add `@keyframes drapery-ripple` and `@keyframes breathing` here when GUIDE 04 needs them.

## 7. Accessibility baked into tokens (non-negotiable)
- `:focus-visible` ring (2px `--ink`) already set — keep on every interactive element.
- Min tap target 44×44, 8px gap (already hinted in base layer).
- Color is never the only signal (countdown, RSVP state, errors carry text + icon).
- Alt text is voice, not filler; decorative imagery `alt=""`.

## 8. Use the installed skill before inventing styles
```bash
cd nikah-web
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "wedding storybook" --category style
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "ivory blush pastel" --category color
python3 .cursor/skills/ui-ux-pro-max/scripts/search.py "elegant serif + humanist sans" --category typography
```
Query, don't guess. But the master + these tokens already define the world — the skill refines, it does not override `hero-main.webp`.

**Acceptance:** every surface uses these tokens (no hardcoded hex/oklch in components), contrast verified on `--paper` and `--cream`, the page reads as one ivory storybook canvas that matches the master's palette and light.
