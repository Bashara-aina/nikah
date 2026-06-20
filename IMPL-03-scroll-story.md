# IMPL-03 — Scroll as Narrative (ACT 2: THE STORY)

> "The guest's thumb is the narrator. Scrolling IS the storytelling."

---

## 0. Complete Asset Map

| File in `/public/assets/` | Source | Section | Notes |
|---|---|---|---|
| `story/story-ch1-vespa.png` | `36.png` | Story CH.1 | White bg. Man on pink Vespa handing backpack to woman in hijab. Flowers, love birds above. "How they met" scene. |
| `story/story-ch2-walking.png` | `png asset website 2/22.png` | Story CH.2 | White bg. Couple walking together, 3 cats trailing behind (black tuxedo, tabby, white kitten). Butterflies. "How they grew" scene. |
| `story/story-ch3-japan.png` | `png asset website 2/23.png` | Story CH.3 | Torii gate, sakura blossoms, couple silhouette on a path, soft sky. Japan travel memory. |
| `florals/sakura-scatter.png` | `25.png` | Story CH.3 | Transparent. Cherry blossom petals in a flowing stream — Japan section particle accent. |
| `frames/arch-frame-cats.png` | `3.png` | Event | Opaque ivory. Floral arch with white cat peeking left, tuxedo cat sitting right — frame for event cards. |
| `frames/arch-frame-2.png` | `26.png` | Event | Opaque ivory. Flatter arch variant, same cats. |
| `frames/wedding-arch-1.png` | `png asset website 2/16.png` | Event | Wedding ceremony arch: flowers on left pillar, cream drapery both sides. Event venue illustration. |
| `frames/wedding-arch-2.png` | `png asset website 2/24.png` | Event | Minimal arch: cream drapery, small floral accent top-left. Cleaner variant. |
| `icons/map-pin.png` | `png asset website 2/25.png` | Event | Illustrated house-shaped map pin (peach/pink roof, flower). Drops at venue mention. |
| `frames/polaroid-frame.png` | `png asset website 2/1.png` | Gallery | Polaroid frame with washi tape top-right and botanical sprig. Use for each gallery photo. |
| `frames/oval-frame.png` | `png asset website 2/13.png` | Gallery | Arched oval floral frame — wildflowers/cosmos. Portrait format. |
| `frames/text-frame.png` | `png asset website 2/20.png` | RSVP / Event | Horizontal rectangular frame with drapery waves + roses. Use as info card background. |
| `icons/gift.png` | `png asset website 2/27.png` | Gift | Gift box (ivory, sage ribbon) + envelope + flowers. Gift section illustration. |
| `icons/laptop-phone.png` | `png asset website 2/21.png` | RSVP | Laptop + smartphone with heart/email connecting them. |
| `dividers/drapery.png` | `18.png` | All sections | TRANSPARENT. White/cream ribbon drapery with flowers + butterfly. Between every section. |
| `dividers/dove-heart.png` | `8.png` | Story sections | TRANSPARENT. Two doves facing with a heart, floral spray. Narrative thread divider. |
| `dividers/paw-divider.png` | `31.png` | All sections | TRANSPARENT. Cat paw prints + petals in a line. Whimsical divider variant. |
| `dividers/flower-line.png` | `10.png` | All sections | TRANSPARENT. Delicate scattered flower dots. Subtle divider. |
| `cats/cats-banner.png` | `30.png` | Welcome / Closing | TRANSPARENT. Moju (ragdoll, "MOJU" tag) + Jiro (tuxedo, red collar) holding a blank banner scroll. |
| `cats/cat-shiro-peek.png` | `png asset website 2/8.png` | Closing | White kitten (Shiro) peeking up from bottom edge, paws on ledge. |
| `cats/cat-tabbies-kiss.png` | `33.png` | Story CH.2 | TRANSPARENT. Two tabby cats nose-touching (Hoshi + Kimho). |
| `cats/cat-moju-sleeping.png` | `24.png` | Closing / Story | TRANSPARENT. Moju (ragdoll, "MOJU" tag) sleeping deeply in a wreath of flowers. |
| `cats/cat-jiro-flowers.png` | `11.png` | Story / sections | TRANSPARENT. Jiro with butterfly, in wildflower meadow. |
| `cats/cat-simba-dove.png` | `14.png` | Story / sections | TRANSPARENT. Simba lying beside a white dove on flowering ground. |
| `doves/doves-perched.png` | `png asset website 2/19.png` | Wishes / Closing | Two cream doves perched on a rose bouquet. |
| `florals/floral-corners.png` | `png asset website 2/11.png` | All sections | Floral corner decorations (top-left + bottom-right pair). Section frame accent. |
| `florals/leaf-sprig.png` | `png asset website 2/12.png` | All sections | Sage leaf sprig, horizontal. Section heading accent. |
| `florals/garland-cat.png` | `34.png` | Closing | TRANSPARENT. Sleeping white cat nestled in a curved floral garland. Closing section header. |
| `cats/cat-hoshi-kimho-play.png` | `16.png` | Story CH.2 | TRANSPARENT. Two tabby cats (Hoshi + Kimho) playing with flower stem + butterfly. |
| `scenes/bg-texture.png` | `17.png` | All sections | Cream/peach watercolor wash. Section backgrounds. |

---

## 1. Full Section Sequence & Narrative Arc

```
SECTION 00 — [HERO]         HeroSection (ACT 1 — separate impl)
SECTION 01 — [WELCOME]      WelcomeSection
SECTION 02 — [STORY CH.1]   StorySection  — "Awal Mula" (How They Met) — Vespa scene
SECTION 03 — [STORY CH.2]   StorySection  — "Tumbuh Bersama" (How They Grew) — Walking cats
SECTION 04 — [STORY CH.3]   StorySection  — "Perjalanan" (Japan memory) — Torii gate
SECTION 05 — [EVENT]        EventSection
SECTION 06 — [GALLERY]      GallerySection
SECTION 07 — [RSVP]         RSVPSection
SECTION 08 — [WISHES]       WishesSection
SECTION 09 — [GIFT]         GiftSection
SECTION 10 — [CLOSING]      ClosingSection
```

Each section is preceded by a `DividerDrapery` component (except the very first after hero, which uses a scroll-exit of the hero itself).

---

## 2. Component Structure

```
src/components/sections/
  WelcomeSection/
    index.tsx
  StorySection/
    index.tsx          ← reused for CH.1, CH.2, CH.3 (props control content)
    StoryIllustration.tsx
  EventSection/
    index.tsx
    CountdownTimer.tsx
    MapPinDrop.tsx
  GallerySection/
    index.tsx
    GalleryPhoto.tsx
    Lightbox.tsx
  RSVPSection/
    index.tsx
    (form components in IMPL-05)
  WishesSection/
    index.tsx
    WishCard.tsx       ← prepend animation in IMPL-05
  GiftSection/
    index.tsx
  ClosingSection/
    index.tsx
  shared/
    SectionWrapper.tsx   ← entrance observer + tier-gated animation
    DividerDrapery.tsx   ← animated drapery divider
    useSectionEntrance.ts
    DoveCross.tsx        ← dove that flies between sections
```

---

## 3. `SectionWrapper.tsx` — Entrance Observer

Every section is wrapped in this. It fires entrance animation exactly once when the section scrolls into view.

```typescript
// components/sections/shared/SectionWrapper.tsx
'use client'
import { useRef, useEffect, ReactNode } from 'react'
import gsap from 'gsap'
import { useMotionTier } from '@/components/MotionProvider'

interface Props {
  children: ReactNode
  className?: string
  id: string
  threshold?: number   // default 0.20
}

export default function SectionWrapper({ children, className, id, threshold = 0.20 }: Props) {
  const ref    = useRef<HTMLElement>(null)
  const played = useRef(false)
  const tier   = useMotionTier()

  useEffect(() => {
    if (!ref.current) return
    if (tier === 'REDUCED') {
      // Just show everything immediately, no animation
      ref.current.style.opacity = '1'
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true
          observer.disconnect()
          // Trigger entrance animation on section's data-animate children
          const illustration = ref.current?.querySelector('[data-animate="illustration"]')
          const heading      = ref.current?.querySelector('[data-animate="heading"]')
          const body         = ref.current?.querySelectorAll('[data-animate="body"]')
          const tl = gsap.timeline()

          if (illustration) {
            const side = (illustration as HTMLElement).dataset.side ?? 'left'
            tl.fromTo(illustration,
              { opacity: 0, x: side === 'left' ? -60 : 60, scale: 0.95 },
              { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: 'power2.out' }, 0)
          }
          if (heading) {
            tl.fromTo(heading,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.35)
          }
          if (body && body.length) {
            tl.fromTo(body,
              { opacity: 0, y: 18 },
              { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, 0.50)
          }
        }
      },
      { threshold }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [tier])

  return (
    <section ref={ref} id={id} className={className} style={{ opacity: tier === 'REDUCED' ? 1 : undefined }}>
      {children}
    </section>
  )
}
```

---

## 4. `StorySection` — The Core Narrative Component

Reused for all 3 story chapters. The `illustrationSide` alternates: CH.1 = right, CH.2 = left, CH.3 = right.

```typescript
// components/sections/StorySection/index.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import SectionWrapper from '../shared/SectionWrapper'
import { useMotionTier } from '@/components/MotionProvider'
import styles from './story.module.css'

interface StorySectionProps {
  id: string
  chapter: 1 | 2 | 3
  illustrationSrc: string
  illustrationSide: 'left' | 'right'
  heading: string
  subheading?: string
  body: string
  decorativeCat?: string    // optional cat cutout path — overlaps illustration
}

export default function StorySection({
  id, chapter, illustrationSrc, illustrationSide,
  heading, subheading, body, decorativeCat
}: StorySectionProps) {
  const illusRef = useRef<HTMLDivElement>(null)
  const tier = useMotionTier()

  // Scrub parallax on the illustration
  useEffect(() => {
    if (!illusRef.current || tier === 'LOW' || tier === 'REDUCED') return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: illusRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          const offset = (self.progress - 0.5) * 30   // ±15px
          gsap.set(illusRef.current, { y: offset })
        }
      })
    })
    return () => ctx.revert()
  }, [tier])

  return (
    <SectionWrapper id={id} className={styles.storySection}>
      <div className={`${styles.storyInner} ${styles[`chapter${chapter}`]}`}>
        {/* Illustration side */}
        <div
          ref={illusRef}
          className={styles.illustrationWrapper}
          data-animate="illustration"
          data-side={illustrationSide}
        >
          <Image
            src={illustrationSrc}
            alt=""
            width={460}
            height={360}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply',  // handles white bg assets
            }}
          />
          {/* Optional decorative cat overlapping corner */}
          {decorativeCat && (
            <Image
              src={decorativeCat}
              alt=""
              width={120}
              height={120}
              className={styles.decorativeCat}
              style={{ mixBlendMode: 'multiply' }}
            />
          )}
        </div>

        {/* Text side */}
        <div className={styles.textWrapper}>
          {subheading && (
            <p className={styles.chapterLabel} data-animate="body">
              {subheading}
            </p>
          )}
          <h2 className={styles.chapterHeading} data-animate="heading">
            {heading}
          </h2>
          {body.split('\n').map((line, i) => (
            <p key={i} className={styles.chapterBody} data-animate="body">
              {line}
            </p>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
```

### Story Chapter Data

```typescript
// data/storySections.ts
export const storySections = [
  {
    id: 'story-ch1',
    chapter: 1 as const,
    illustrationSrc: '/assets/story/story-ch1-vespa.png',
    illustrationSide: 'right' as const,
    heading: 'Awal Mula',
    subheading: 'Bab Satu',
    body: 'Pertemuan itu tak pernah direncanakan.\nSebuah kebetulan yang ternyata bukan kebetulan.',
    decorativeCat: '/assets/cats/cat-simba-dove.png',
  },
  {
    id: 'story-ch2',
    chapter: 2 as const,
    illustrationSrc: '/assets/story/story-ch2-walking.png',
    illustrationSide: 'left' as const,
    heading: 'Tumbuh Bersama',
    subheading: 'Bab Dua',
    body: 'Dua jiwa, enam cakar kecil, dan satu arah.\nBerjalan — perlahan menjadi rumah.',
    decorativeCat: '/assets/cats/cat-tabbies-kiss.png',
  },
  {
    id: 'story-ch3',
    chapter: 3 as const,
    illustrationSrc: '/assets/story/story-ch3-japan.png',
    illustrationSide: 'right' as const,
    heading: 'Perjalanan',
    subheading: 'Bab Tiga',
    body: 'Di bawah torii merah dan sakura yang gugur,\ncinta ini resmi kami akui.',
    decorativeCat: undefined,
  },
]
```

---

## 5. `story.module.css`

```css
/* story.module.css */

.storySection {
  padding: 80px 24px;
  background: var(--color-ivory);
  position: relative;
  overflow: hidden;
}

.storyInner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  max-width: 560px;
  margin: 0 auto;
}

/* On desktop, two columns */
@media (min-width: 768px) {
  .storyInner {
    grid-template-columns: 1fr 1fr;
    max-width: 960px;
    align-items: center;
    gap: 60px;
  }
  /* Alternate layout: odd chapters = illustration right */
  .chapter1 .illustrationWrapper,
  .chapter3 .illustrationWrapper { order: 2; }
  .chapter1 .textWrapper,
  .chapter3 .textWrapper         { order: 1; }
}

.illustrationWrapper {
  position: relative;
  opacity: 0;   /* SectionWrapper animates this */
}

.decorativeCat {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 120px;
  height: auto;
}

.textWrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chapterLabel {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-dusty);
  opacity: 0;
}
.chapterHeading {
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  color: var(--color-ink);
  line-height: 1.15;
  opacity: 0;
}
.chapterBody {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.75;
  color: var(--color-muted);
  opacity: 0;
}
```

---

## 6. `DividerDrapery.tsx` — Between Every Section

```typescript
// components/sections/shared/DividerDrapery.tsx
import Image from 'next/image'
import styles from './divider.module.css'

type Variant = 'drapery' | 'dove-heart' | 'paw' | 'flower-line'

interface Props { variant?: Variant; flip?: boolean }

const VARIANTS: Record<Variant, string> = {
  'drapery':     '/assets/dividers/drapery.png',
  'dove-heart':  '/assets/dividers/dove-heart.png',
  'paw':         '/assets/dividers/paw-divider.png',
  'flower-line': '/assets/dividers/flower-line.png',
}

export default function DividerDrapery({ variant = 'drapery', flip = false }: Props) {
  return (
    <div className={styles.dividerWrapper} aria-hidden>
      <Image
        src={VARIANTS[variant]}
        alt=""
        width={1200}
        height={80}
        style={{
          width: '100%',
          height: 'auto',
          transform: flip ? 'scaleY(-1)' : undefined,
          animation: variant === 'drapery' ? 'draperyRipple 8s ease-in-out infinite' : undefined,
        }}
      />
    </div>
  )
}

/* divider.module.css:
.dividerWrapper {
  width: 100%;
  overflow: hidden;
  margin: -2px 0;   -- overlap sections slightly
  pointer-events: none;
}
@keyframes draperyRipple {
  0%, 100% { transform: scaleY(1)     translateX(0%);    }
  50%       { transform: scaleY(1.003) translateX(-1.5%); }
}
*/
```

**Divider assignment per section boundary:**
- Hero → Welcome: no divider (hero exits on scroll)
- Welcome → CH.1: `dove-heart`
- CH.1 → CH.2: `drapery`
- CH.2 → CH.3: `paw`
- CH.3 → Event: `drapery` (flipped)
- Event → Gallery: `flower-line`
- Gallery → RSVP: `drapery`
- RSVP → Wishes: `dove-heart`
- Wishes → Gift: `paw`
- Gift → Closing: `drapery` (flipped)

---

## 7. `DoveCross.tsx` — Dove Flying Between Sections

```typescript
// components/sections/shared/DoveCross.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import Image from 'next/image'

gsap.registerPlugin(MotionPathPlugin)

interface Props { triggerId: string }   // element ID to watch

export default function DoveCross({ triggerId }: Props) {
  const doveRef  = useRef<HTMLDivElement>(null)
  const didFlyRef = useRef(false)

  useEffect(() => {
    const trigger = document.getElementById(triggerId)
    if (!trigger || !doveRef.current) return
    const el = doveRef.current

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !didFlyRef.current) {
          didFlyRef.current = true
          observer.disconnect()
          gsap.fromTo(el,
            { x: '-5vw', y: `${30 + Math.random() * 20}vh`, opacity: 0 },
            {
              motionPath: {
                path: [
                  { x: '30vw',  y: `${25 + Math.random() * 10}vh` },
                  { x: '70vw',  y: `${20 + Math.random() * 10}vh` },
                  { x: '110vw', y: `${28 + Math.random() * 10}vh` },
                ],
                curviness: 1.2,
              },
              opacity: 1,
              duration: 4 + Math.random() * 2,
              ease: 'sine.inOut',
              onComplete: () => gsap.set(el, { opacity: 0 })
            }
          )
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(trigger)
    return () => observer.disconnect()
  }, [triggerId])

  return (
    <div ref={doveRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 50, pointerEvents: 'none', opacity: 0, width: 60 }} aria-hidden>
      <Image src="/assets/doves/doves-flying.png" alt="" width={60} height={45} />
    </div>
  )
}
```

Place one `<DoveCross triggerId="story-ch2" />` between CH.1→CH.2, one between CH.2→CH.3.

---

## 8. `WelcomeSection`

```typescript
// components/sections/WelcomeSection/index.tsx
import SectionWrapper from '../shared/SectionWrapper'
import Image from 'next/image'
import styles from './welcome.module.css'

interface Props { guestName: string }

export default function WelcomeSection({ guestName }: Props) {
  return (
    <SectionWrapper id="welcome" className={styles.welcomeSection}>
      {/* Cats holding banner — banner text is overlaid CSS */}
      <div className={styles.bannerWrapper} data-animate="illustration" data-side="left">
        <Image
          src="/assets/cats/cats-banner.png"
          alt=""
          width={700}
          height={260}
          style={{ width: '100%', height: 'auto' }}
        />
        <div className={styles.bannerText}>
          <p>Dengan penuh cinta</p>
          <p>kami mengundang</p>
          <p className={styles.bannerName}>{guestName || 'Tamu Terkasih'}</p>
        </div>
      </div>

      <div className={styles.welcomeBody}>
        <p data-animate="heading" className={styles.welcomeHeading}>
          Bismillah, kami menikah.
        </p>
        <p data-animate="body" className={styles.welcomeCopy}>
          Sebuah undangan dari hati kami — untuk hadir dalam hari paling bahagia hidup kami.
        </p>
      </div>

      {/* Leaf sprig accent */}
      <Image
        src="/assets/florals/leaf-sprig.png"
        alt="" aria-hidden
        width={200} height={60}
        className={styles.leafAccent}
        data-animate="body"
      />
    </SectionWrapper>
  )
}
```

---

## 9. `EventSection` — Date, Venue, Countdown, Map Pin

```typescript
// components/sections/EventSection/index.tsx
import SectionWrapper from '../shared/SectionWrapper'
import CountdownTimer from './CountdownTimer'
import MapPinDrop from './MapPinDrop'
import Image from 'next/image'
import styles from './event.module.css'

const WEDDING_DATE = new Date('2025-10-26T10:00:00+07:00')

export default function EventSection() {
  return (
    <SectionWrapper id="event" className={styles.eventSection}>
      {/* Background texture */}
      <Image
        src="/assets/scenes/bg-texture.png"
        alt="" aria-hidden
        fill
        style={{ objectFit: 'cover', opacity: 0.5, zIndex: 0 }}
      />

      {/* Wedding arch illustration — behind content */}
      <div className={styles.archWrapper} data-animate="illustration" data-side="left" aria-hidden>
        <Image
          src="/assets/frames/wedding-arch-2.png"
          alt=""
          width={300}
          height={400}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      <div className={styles.eventContent}>
        {/* Date — large serif, scale-in */}
        <h2 className={styles.eventDate} data-animate="heading">
          Ahad, 26 Oktober 2025
        </h2>

        {/* Leaf sprig divider */}
        <Image src="/assets/florals/leaf-sprig.png" alt="" aria-hidden width={160} height={48} className={styles.sprig} data-animate="body" />

        {/* Akad */}
        <div className={styles.eventCard} data-animate="body">
          <p className={styles.eventType}>Akad Nikah</p>
          <p className={styles.eventTime}>08.00 WIB</p>
          <p className={styles.eventVenue}>Masjid Agung Kota</p>

          <MapPinDrop label="Lihat Lokasi" mapsUrl="https://maps.google.com" />
        </div>

        {/* Resepsi */}
        <div className={styles.eventCard} data-animate="body">
          <p className={styles.eventType}>Resepsi</p>
          <p className={styles.eventTime}>11.00 – 14.00 WIB</p>
          <p className={styles.eventVenue}>Gedung Pernikahan Al-Hikmah</p>
          <MapPinDrop label="Lihat Lokasi" mapsUrl="https://maps.google.com" />
        </div>

        {/* Floral frame around countdown */}
        <div className={styles.countdownWrapper} data-animate="body">
          <Image
            src="/assets/frames/oval-frame.png"
            alt="" aria-hidden
            width={280} height={200}
            className={styles.countdownFrame}
          />
          <CountdownTimer target={WEDDING_DATE} />
        </div>
      </div>
    </SectionWrapper>
  )
}
```

### `CountdownTimer.tsx`

Each digit animates independently on change (CSS translateY flip).

```typescript
// components/sections/EventSection/CountdownTimer.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './event.module.css'

interface Props { target: Date }

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000)  / 60000),
    s: Math.floor((diff % 60000)    / 1000),
  }
}

function FlipDigit({ value, label }: { value: number; label: string }) {
  const prevRef = useRef(value)
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (prevRef.current !== value && spanRef.current) {
      spanRef.current.classList.remove(styles.digitFlip)
      void spanRef.current.offsetWidth   // reflow
      spanRef.current.classList.add(styles.digitFlip)
    }
    prevRef.current = value
  }, [value])

  return (
    <div className={styles.digitBlock}>
      <span ref={spanRef} className={styles.digitValue}>
        {String(value).padStart(2, '0')}
      </span>
      <span className={styles.digitLabel}>{label}</span>
    </div>
  )
}

export default function CountdownTimer({ target }: Props) {
  const [time, setTime] = useState(getTimeLeft(target))
  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className={styles.countdown}>
      <FlipDigit value={time.d} label="Hari"   />
      <span className={styles.colon}>:</span>
      <FlipDigit value={time.h} label="Jam"    />
      <span className={styles.colon}>:</span>
      <FlipDigit value={time.m} label="Menit"  />
      <span className={styles.colon}>:</span>
      <FlipDigit value={time.s} label="Detik"  />
    </div>
  )
}
```

### `MapPinDrop.tsx`

```typescript
// components/sections/EventSection/MapPinDrop.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import Image from 'next/image'

interface Props { label: string; mapsUrl: string }

export default function MapPinDrop({ label, mapsUrl }: Props) {
  const pinRef = useRef<HTMLDivElement>(null)
  const played = useRef(false)

  useEffect(() => {
    const el = pinRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true
          gsap.fromTo(el,
            { y: -40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'back.out(2)' })
        }
      }, { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="map-pin-link">
      <div ref={pinRef} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Image
          src="/assets/icons/map-pin.png"
          alt="Lokasi"
          width={40}
          height={48}
        />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--color-dusty)' }}>
          {label}
        </span>
      </div>
    </a>
  )
}
```

---

## 10. `GallerySection` — Scrapbook Style

Each photo is wrapped in `frames/polaroid-frame.png` and has a random ±2–4° rotation applied at render time (stable, never changes).

```typescript
// components/sections/GallerySection/index.tsx
'use client'
import { useMemo } from 'react'
import Image from 'next/image'
import SectionWrapper from '../shared/SectionWrapper'
import styles from './gallery.module.css'

// Prewedding photos — real uploaded images in /public/photos/
const PHOTOS = [
  '/photos/prewedding-01.jpg',
  '/photos/prewedding-02.jpg',
  '/photos/prewedding-03.jpg',
  '/photos/prewedding-04.jpg',
  '/photos/prewedding-05.jpg',
  '/photos/prewedding-06.jpg',
]

function seededRotation(index: number): number {
  // Deterministic rotation so server/client match (no hydration mismatch)
  const rotations = [-3.2, 2.8, -2.1, 3.8, -1.5, 2.3, -4.0, 1.9, -3.5, 2.6]
  return rotations[index % rotations.length]
}

export default function GallerySection() {
  return (
    <SectionWrapper id="gallery" className={styles.gallerySection}>
      <h2 className={styles.galleryTitle} data-animate="heading">
        Kenangan Kita
      </h2>

      <div className={styles.galleryGrid}>
        {PHOTOS.map((src, i) => (
          <GalleryPhoto key={src} src={src} index={i} rotation={seededRotation(i)} />
        ))}
      </div>
    </SectionWrapper>
  )
}

function GalleryPhoto({ src, index, rotation }: { src: string; index: number; rotation: number }) {
  return (
    <div
      className={styles.photoWrapper}
      data-animate="body"
      style={{ '--rotation': `${rotation}deg`, '--delay': `${index * 0.08}s` } as React.CSSProperties}
    >
      {/* Polaroid frame */}
      <div className={styles.polaroidFrame}>
        <Image
          src="/assets/frames/polaroid-frame.png"
          alt="" aria-hidden
          fill
          style={{ objectFit: 'fill', zIndex: 2, pointerEvents: 'none' }}
        />
        {/* Actual photo */}
        <div className={styles.photoInner}>
          <Image
            src={src}
            alt={`Kenangan ${index + 1}`}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  )
}
```

```css
/* gallery.module.css */
.gallerySection {
  padding: 80px 20px;
  background: var(--color-cream);
}
.galleryTitle {
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  text-align: center;
  color: var(--color-ink);
  margin-bottom: 48px;
  opacity: 0;
}
.galleryGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 560px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .galleryGrid { grid-template-columns: repeat(3, 1fr); max-width: 900px; }
}
.photoWrapper {
  transform: rotate(var(--rotation, 0deg));
  transition: transform 0.3s var(--ease-settle), box-shadow 0.3s ease;
  cursor: pointer;
  opacity: 0;
  animation-delay: var(--delay, 0s);
}
.photoWrapper:hover, .photoWrapper:focus {
  transform: rotate(0deg) scale(1.04);
  box-shadow: 0 12px 32px rgba(74, 64, 57, 0.18);
  z-index: 5;
}
.polaroidFrame {
  position: relative;
  aspect-ratio: 4/5;
  background: #FBF7F0;
  padding: 10px 10px 32px 10px;   /* polaroid bottom larger */
  border-radius: 2px;
  box-shadow: 0 4px 16px rgba(74, 64, 57, 0.12);
}
.photoInner {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 1px;
}
```

**Scatter entrance animation** (in `SectionWrapper.tsx` — override for gallery):
- Each `.photoWrapper` with `data-animate="body"` gets stagger from its random direction
- GSAP: `{ opacity: 0, x: Math.random()*20-10, y: Math.random()*20+10 }` → `{ opacity: 1, x: 0, y: 0, stagger: 0.06 }`

---

## 11. `ClosingSection`

```typescript
// components/sections/ClosingSection/index.tsx
import SectionWrapper from '../shared/SectionWrapper'
import Image from 'next/image'
import styles from './closing.module.css'
// CatPeek is from IMPL-05

export default function ClosingSection() {
  return (
    <SectionWrapper id="closing" className={styles.closingSection}>
      {/* Sleeping cat in garland header */}
      <div data-animate="illustration" data-side="left">
        <Image
          src="/assets/florals/garland-cat.png"
          alt="" aria-hidden
          width={500}
          height={160}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {/* Closing poem */}
      <div className={styles.poem} data-animate="heading">
        <p>Doa terbaik kami</p>
        <p>untuk setiap langkah kalian</p>
        <p>yang hadir merayakan.</p>
      </div>

      <p className={styles.hashtag} data-animate="body">
        #BukaSebuahCerita
      </p>

      {/* Doves perched on flowers */}
      <div data-animate="body" style={{ textAlign: 'center', marginTop: 40 }}>
        <Image
          src="/assets/doves/doves-perched.png"
          alt="" aria-hidden
          width={160} height={120}
        />
      </div>

      {/* Moju sleeping — farewell */}
      <div data-animate="body" style={{ textAlign: 'center', marginTop: 24 }}>
        <Image
          src="/assets/cats/cat-moju-sleeping.png"
          alt="" aria-hidden
          width={200} height={180}
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Cat peek — Shiro from bottom (implemented in IMPL-05) */}
      {/* <CatPeek /> */}
    </SectionWrapper>
  )
}
```

---

## 12. `GiftSection`

```typescript
// components/sections/GiftSection/index.tsx
import SectionWrapper from '../shared/SectionWrapper'
import Image from 'next/image'
import styles from './gift.module.css'
// CopyButton from IMPL-05

export default function GiftSection() {
  return (
    <SectionWrapper id="gift" className={styles.giftSection}>
      <div data-animate="illustration" data-side="right">
        <Image
          src="/assets/icons/gift.png"
          alt="" aria-hidden
          width={200} height={180}
          style={{ width: '160px', height: 'auto' }}
        />
      </div>

      <h2 className={styles.giftTitle} data-animate="heading">Hadiah Doa & Cinta</h2>

      <p className={styles.giftSubtitle} data-animate="body">
        Kehadiran kalian adalah hadiah terbesar.
        Namun jika berkenan, kiriman doa bisa disertai lewat:
      </p>

      <div className={styles.bankInfo} data-animate="body">
        <p className={styles.bankName}>BCA</p>
        <p className={styles.accountNumber}>1234567890</p>
        <p className={styles.accountHolder}>a.n. Bashara / Aina</p>
        {/* <CopyButton text="1234567890" /> */}
      </div>

      <Image
        src="/assets/florals/leaf-sprig.png"
        alt="" aria-hidden
        width={120} height={36}
        data-animate="body"
        style={{ margin: '24px auto', display: 'block' }}
      />
    </SectionWrapper>
  )
}
```

---

## 13. Japan Chapter — Sakura Particle Override

When `story-ch3` enters viewport, signal `ParticleCanvas` (or the ambient canvas) to shift color to soft sakura pink and add 2 extra particles.

```typescript
// In StorySection for chapter 3:
useEffect(() => {
  if (chapter !== 3) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        window.dispatchEvent(new CustomEvent('section-enter', { detail: { section: 'japan' } }))
      } else {
        window.dispatchEvent(new CustomEvent('section-exit',  { detail: { section: 'japan' } }))
      }
    }, { threshold: 0.3 }
  )
  if (sectionRef.current) observer.observe(sectionRef.current)
  return () => observer.disconnect()
}, [chapter])

// In ParticleCanvas, listen:
useEffect(() => {
  const onEnter = (e: CustomEvent) => {
    if (e.detail.section === 'japan') {
      particleColorOverride.current = '#FFCAD4'   // soft sakura
      particleCountOverride.current = 2            // extra 2
    }
  }
  const onExit = (e: CustomEvent) => {
    if (e.detail.section === 'japan') {
      particleColorOverride.current = null
      particleCountOverride.current = 0
    }
  }
  window.addEventListener('section-enter', onEnter as EventListener)
  window.addEventListener('section-exit',  onExit  as EventListener)
  return () => {
    window.removeEventListener('section-enter', onEnter as EventListener)
    window.removeEventListener('section-exit',  onExit  as EventListener)
  }
}, [])
```

---

## 14. Page Assembly in `app/page.tsx`

```typescript
// After gate transition completes, MainPage renders:
<MotionProvider>
  <LenisProvider>   {/* Lenis smooth scroll wraps everything */}
    <AmbientLayer>  {/* see IMPL-04 */}
      <HeroSection triggerAssemble={true} guestName={guestName} />
      <DoveCross triggerId="story-ch2" />
      <DoveCross triggerId="story-ch3" />

      <DividerDrapery variant="dove-heart" />
      <WelcomeSection guestName={guestName} />

      {storySections.map(s => (
        <Fragment key={s.id}>
          <DividerDrapery variant={s.chapter === 2 ? 'drapery' : 'paw'} />
          <StorySection {...s} />
        </Fragment>
      ))}

      <DividerDrapery variant="drapery" flip />
      <EventSection />

      <DividerDrapery variant="flower-line" />
      <GallerySection />

      <DividerDrapery variant="drapery" />
      <RSVPSection />

      <DividerDrapery variant="dove-heart" />
      <WishesSection />

      <DividerDrapery variant="paw" />
      <GiftSection />

      <DividerDrapery variant="drapery" flip />
      <ClosingSection />
    </AmbientLayer>
  </LenisProvider>
</MotionProvider>
```

---

## 15. Asset Copy Additions (beyond IMPL-02)

```bash
SRC="Recovered/correct/most correct"
PUB="public/assets"
mkdir -p "$PUB/story" "$PUB/frames" "$PUB/dividers" "$PUB/icons" "$PUB/doves"

# Story illustrations
cp "$SRC/36.png"                          "$PUB/story/story-ch1-vespa.png"
cp "$SRC/png asset website 2/22.png"      "$PUB/story/story-ch2-walking.png"
cp "$SRC/png asset website 2/23.png"      "$PUB/story/story-ch3-japan.png"

# Frames
cp "$SRC/3.png"                           "$PUB/frames/arch-frame-cats.png"
cp "$SRC/26.png"                          "$PUB/frames/arch-frame-2.png"
cp "$SRC/png asset website 2/16.png"      "$PUB/frames/wedding-arch-1.png"
cp "$SRC/png asset website 2/24.png"      "$PUB/frames/wedding-arch-2.png"
cp "$SRC/png asset website 2/1.png"       "$PUB/frames/polaroid-frame.png"
cp "$SRC/png asset website 2/13.png"      "$PUB/frames/oval-frame.png"
cp "$SRC/png asset website 2/20.png"      "$PUB/frames/text-frame.png"

# Dividers
cp "$SRC/18.png"                          "$PUB/dividers/drapery.png"
cp "$SRC/8.png"                           "$PUB/dividers/dove-heart.png"
cp "$SRC/31.png"                          "$PUB/dividers/paw-divider.png"
cp "$SRC/10.png"                          "$PUB/dividers/flower-line.png"

# Icons
cp "$SRC/png asset website 2/25.png"      "$PUB/icons/map-pin.png"
cp "$SRC/png asset website 2/27.png"      "$PUB/icons/gift.png"
cp "$SRC/png asset website 2/21.png"      "$PUB/icons/laptop-phone.png"

# Doves
cp "$SRC/png asset website 2/19.png"      "$PUB/doves/doves-perched.png"

# Cats (additions)
cp "$SRC/30.png"      "$PUB/cats/cats-banner.png"
cp "$SRC/33.png"      "$PUB/cats/cat-tabbies-kiss.png"
cp "$SRC/24.png"      "$PUB/cats/cat-moju-sleeping.png"
cp "$SRC/11.png"      "$PUB/cats/cat-jiro-flowers.png"
cp "$SRC/16.png"      "$PUB/cats/cat-hoshi-kimho-play.png"

# Florals (additions)
cp "$SRC/34.png"                          "$PUB/florals/garland-cat.png"
cp "$SRC/25.png"                          "$PUB/florals/sakura-scatter.png"
cp "$SRC/png asset website 2/11.png"      "$PUB/florals/floral-corners.png"
cp "$SRC/png asset website 2/12.png"      "$PUB/florals/leaf-sprig.png"
```
