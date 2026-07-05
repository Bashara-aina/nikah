# REF 02 — BUILD MANIFEST: FILE TREE, CONTRACTS & ASSEMBLY ORDER

> The structural blueprint. What already exists, what to create, in what order, and how the pieces connect. Prevents Cursor from inventing a parallel structure. Companion to the 5 guides.

---

## 0. What already exists (✅ extend, don't recreate)
```
nikah-web/
├── app/
│   ├── layout.tsx          ✅ fonts (Cormorant+Inter), MotionProvider, LenisProvider, metadata/OG
│   ├── page.tsx            ✅ Particles + Gate + Hero + 8 section STUBS + <audio.site-audio>
│   ├── globals.css         ✅ Tailwind v4 @theme OKLCH tokens, z-scale vars, a11y base, reduced-motion
│   └── api/rsvp/route.ts   ✅ POST → APPS_SCRIPT_URL, project envelope {success,data,error} (extend: cap pax)
├── components/
│   ├── sections/Gate.tsx   ✅ opening gate (Motion + AnimatePresence + audio fade + gyro)
│   ├── hero/{Hero,Doves,Butterflies,heroLayout}.tsx/ts  ✅ hero shell + layer config (calibrate to master)
│   ├── motion/{MotionProvider,Lenis,Particles,useGyro,useParallax,useReveal,useVideoLayer}  ✅
│   └── primitives/{VideoLayer,MotionReveal,MotionFloat,Reveal,Sway}.tsx  ✅
├── lib/{config,guest,tier,motionTokens,motionAdapter}.ts  ✅  (config still TBD — see REF 04)
├── scripts/copy-assets.mjs ✅  (assets/ → public/assets/ mirror, runs on predev/prebuild)
└── docs/ 01–13, spec/*, build/*  ✅ canonical
```

## 1. What to create (⬜ build these — names are contracts)
```
scripts/
  generate-manifest.json          ⬜ asset triage (GUIDE 01 §3)
  generate-assets.mjs             ⬜ fal pipeline (GUIDE 01 §4)
  generate-guest-links.mjs        ⬜ CSV → ?to= URLs (REF 04)
app/api/
  wishes/route.ts                 ⬜ GET feed + POST new wish → Apps Script (REF 03)
lib/
  copy.ts                         ⬜ ALL Indonesian copy from docs/03, typed (REF 04)
  calendar.ts                     ⬜ .ics builder + Google Calendar URL
components/
  sections/
    Loading.tsx                   ⬜ 1–2s wreath, then crossfade to Gate (GUIDE 02 A.2)
    Welcome.tsx Countdown.tsx     ⬜ (GUIDE 03 §1–2)
    Story.tsx StoryChapter.tsx    ⬜ 6-chapter reusable (GUIDE 03 §3)
    Japan.tsx                     ⬜ sakura particle override (GUIDE 03 §4)
    Event.tsx Gallery.tsx         ⬜ (GUIDE 03 §5–6)
    Rsvp.tsx Wishes.tsx Gift.tsx Faq.tsx  ⬜ (GUIDE 04 C)
    Closing.tsx                   ⬜ hero echo + cat-peek (GUIDE 04 C.4)
    shared/
      SectionWrapper.tsx          ⬜ entrance observer + tier gating (GUIDE 03 §0)
      AmbientLayer.tsx            ⬜ wraps page: particles, doves, audio, scroll line (GUIDE 04 A)
      AudioManager.tsx            ⬜ persistent toggle, localStorage (GUIDE 04 B)
      Divider.tsx                 ⬜ drapery divider between sections
  hooks/
    useCountdown.ts               ⬜ (GUIDE 03 §2)
  interactions/
    useRipple.ts PillSelect.tsx FloatLabelInput.tsx SubmitButton.tsx  ⬜
    CopyButton.tsx Toast.tsx AccordionItem.tsx WishCard.tsx           ⬜
    StickyRSVP.tsx ScrollTop.tsx CatPeek.tsx ScrollHint.tsx MusicNote.tsx  ⬜  (GUIDE 05 A)
```
Keep names exactly as above — the guides reference them. Match the existing file style (JSDoc header, `"use client"` only where needed, typed props, no `any`).

## 2. `app/page.tsx` — final assembly order
Evolve the existing stubs into real sections **in this order** (one continuous ivory canvas, no nav bar):
```tsx
<AmbientLayer>                    {/* particles + doves + audio + scroll progress, persistent */}
  <Loading />                     {/* sessionStorage skip on refresh */}
  <Gate onOpened={…} />           {/* AnimatePresence exit → Hero assemble */}
  <Hero start={opened} />         {/* the master, brought to life (GUIDE 02 B.0) */}
  <Welcome /> <Countdown />
  <Story />                       {/* 6 chapters incl. Japan beat */}
  <Japan />
  <Event /> <Gallery />
  <Rsvp /> <Wishes /> <Gift /> <Faq />
  <Closing />
  <StickyRSVP /> <ScrollTop />    {/* floating UI */}
  <audio className="site-audio" … />  {/* already present — keep */}
</AmbientLayer>
```
Carry `opened` (gate tapped) in `page.tsx` state or a tiny `useInvitation()` context (GUIDE 02 A.3). Particles already mount in `page.tsx` — move them inside `AmbientLayer` so all ambient systems share one RAF.

## 3. RSC vs Client boundaries (Next 16 — get this right)
- `app/page.tsx` + `layout.tsx` stay **Server Components** (they already are). They import client components, which is fine.
- Anything using hooks/`motion`/`gsap`/`window`/refs/state is **`"use client"`** (Gate, Hero, all motion + interaction components — already the pattern).
- Read `?to=` on the **client** (Gate already does, SSR-safe via `typeof window` guard). Do not make `page.tsx` rely on `searchParams` for the guest name (keeps it static/cacheable).
- `siteConfig`/`copy` are plain modules — importable from both server and client.
- Keep `@fal-ai/client` **out of any component import graph** — it's script-only (`AGENTS.md`). The site only imports finished media URLs.

## 4. Build order (per-section, after Phase A assets land)
Follow the guide order; ship in small typed PRs on the existing `feature/*` branch:
1. **REF 01 tokens** (add dusty/peach/z-scale) → foundation.
2. **AmbientLayer + AudioManager** shell (so every later section gets ambient + audio for free).
3. **Gate + Loading + Hero** (GUIDE 02) — the proof-of-feel; test on a real phone.
4. **Welcome → Countdown → Story → Japan → Event → Gallery** (GUIDE 03).
5. **Rsvp → Wishes → Gift → Faq → Closing** (GUIDE 04) + backend (REF 03).
6. **Interactions + polish + deploy** (GUIDE 05 + REF 05).

## 5. Per-component contract pattern
Every section: a `"use client"` component that (a) renders content from `copy.ts`/`siteConfig`, (b) wraps itself in `SectionWrapper` for entrance + tier gating, (c) consults `useMotion().tier` before adding bespoke motion, (d) cleans up GSAP/ScrollTrigger on unmount. Props are typed; no `any`; API boundaries validated.

## 6. Gates before merging anything
`npm run type-check` + `npm run lint` + `npm run build` all green (catches RSC boundary mistakes). Conventional Commits. Never commit to `main`. Don't edit `public/assets/` (edit `assets/` + `npm run copy-assets`).

**Acceptance:** the file tree matches this manifest, `page.tsx` assembles all real sections in order, RSC/client boundaries are correct, and `npm run build` passes.
