# IMPL-02 — The Living Hero (ACT 1: THE LIVING WORLD)

> "The hero is a paper diorama the guest holds in their hand."

---

## 0. Complete Asset Inventory for the Hero

All assets go in `/public/assets/`. Source paths from the recovered folder.

| File in `/public/assets/` | Source | Layer | Notes |
|---|---|---|---|
| `scenes/hero-bg.png` | `5.png` (or `43.png`) | z=0 (bg) | OPAQUE. Warm golden-hour sky, 5 cats in wildflower meadow. This is the hero canvas. |
| `scenes/bg-texture.png` | `17.png` (or `40.png`) | z=0 | OPAQUE cream/peach watercolor wash — used as base behind hero-bg |
| `florals/meadow-fg.png` | `2.png` | z=1 (ground) | TRANSPARENT. Bottom-anchored wildflower meadow — daisy/cosmos/lavender/butterfly |
| `florals/meadow-fg-2.png` | `20.png` | z=1 (ground alt) | TRANSPARENT. Denser wildflower version, more pink/purple |
| `couple/couple-standing.png` | `png asset website 2/10.png` | z=2 (couple) | White bg — needs CSS `mix-blend-mode: multiply` OR background must match. Couple: woman in hijab (beige), man in grey shirt, sage trousers. |
| `cats/cat-jiro.png` | `png asset website 2/9.png` | z=3 (cats) | TRANSPARENT-ish. Jiro: black/white tuxedo, fluffy, red collar "JIRO" tag. |
| `cats/cat-moju.png` | `png asset website 2/3.png` | z=3 (cats) | White bg. Moju: ragdoll/Birman, dark face, cream body, "MOJU" tag. Use `mix-blend-mode: multiply`. |
| `cats/cat-shiro.png` | `png asset website 2/4.png` | z=3 (cats) | White bg. Shiro: tiny white kitten, blue eyes, pink ears. |
| `cats/cat-simba.png` | `png asset website 2/5.png` | z=3 (cats) | White bg. Simba: orange tabby, leaning forward, round collar tag. |
| `cats/cat-hoshi.png` | `png asset website 2/6.png` | z=3 (cats) | White bg. Hoshi: grey/brown tabby, sitting upright, curious expression. |
| `cats/cat-kimho.png` | `png asset website 2/7.png` | z=3 (cats) | White bg. Kimho: similar tabby, collar with disc tag, green eyes. |
| `cats/cat-shiro-peek.png` | `png asset website 2/8.png` | CLOSING only | TRANSPARENT. White kitten peeking up from bottom edge. Used in ClosingSection, not hero. |
| `florals/vine-left.png` | `6.png` (or `37.png`) | z=4 (foreground) | TRANSPARENT. Vertical botanical vine, pink flowers + butterfly. Left edge accent. |
| `florals/garland-swag.png` | `7.png` (or `41.png`) | z=4 (foreground) | TRANSPARENT. U-shaped floral garland swag. Top-center of hero. |
| `florals/dove-heart.png` | `8.png` (or `42.png`) | z=4 | TRANSPARENT. Two doves + heart + flowers. Center accent. |
| `doves/doves-flying.png` | `png asset website 2/15.png` | z=5 (particles) | TRANSPARENT. Two cream doves mid-flight. Use for MotionPath animation. |
| `butterflies/butterflies-pair.png` | `png asset website 2/17.png` | z=5 (particles) | TRANSPARENT. Two pink blush butterflies. Use for MotionPath animation. |
| `cats/cat-simba-dove.png` | `14.png` | z=3 (alt cat) | TRANSPARENT. Simba lying with a dove beside him — foreground scene variant. |
| `cats/cats-trio-doves.png` | `27.png` | z=3 (group) | TRANSPARENT. Orange+white+tabby cats with doves and butterflies — group scene. |

---

## 1. Component Tree

```
src/components/
  HeroSection/
    index.tsx               ← orchestrates assemble, idle, parallax
    HeroLayer.tsx           ← generic positioned layer wrapper
    HeroText.tsx            ← names / date / hashtag overlay
    ParticleCanvas.tsx      ← petals / pollen RAF canvas
    DovesPath.tsx           ← GSAP MotionPath dove animation
    ButterfliesPath.tsx     ← GSAP bezier butterfly + wing flutter
    useGyroParallax.ts      ← DeviceOrientationEvent → lerp → RAF
    useScrollParallax.ts    ← GSAP ScrollTrigger per layer
    heroLayout.config.ts    ← positions, depths, phases for all layers
    hero.module.css         ← breathing loops, layer base styles
```

---

## 2. `heroLayout.config.ts` — Complete Layer Definitions

```typescript
// components/HeroSection/heroLayout.config.ts
export interface LayerConfig {
  id: string
  type: 'bg' | 'couple' | 'cat' | 'floral' | 'particle' | 'text'
  asset: string                        // path relative to /public/assets/
  depthTier: 0 | 1 | 2 | 3 | 4 | 5
  position: { x: string; y: string }  // % from left/top of container
  size: { w: string; h: string }
  parallaxFactor: number               // multiplier for gyro/scroll offset
  breathingPhase: number               // radians — randomize at build time
  breathingDuration: number            // ms — 4000–7000
  assembleDelay: number                // ms offset in assemble timeline
  blendMode?: string                   // CSS mix-blend-mode for white-bg assets
  zIndex: number
}

export const heroLayers: LayerConfig[] = [
  // ── DEPTH 0: Background ──────────────────────────────────────
  {
    id: 'bg-texture',
    type: 'bg',
    asset: 'scenes/bg-texture.png',
    depthTier: 0,
    position: { x: '0%', y: '0%' },
    size: { w: '100%', h: '100%' },
    parallaxFactor: 0.02,
    breathingPhase: 0,
    breathingDuration: 30000,   // used for the slow horizontal cloud drift
    assembleDelay: 0,
    zIndex: 0,
  },
  {
    id: 'hero-bg',
    type: 'bg',
    asset: 'scenes/hero-bg.png',
    depthTier: 0,
    position: { x: '0%', y: '0%' },
    size: { w: '100%', h: '100%' },
    parallaxFactor: 0.02,
    breathingPhase: 0.3,
    breathingDuration: 30000,
    assembleDelay: 0,
    zIndex: 1,
  },

  // ── DEPTH 1: Ground / Meadow ──────────────────────────────────
  {
    id: 'meadow-fg',
    type: 'floral',
    asset: 'florals/meadow-fg.png',
    depthTier: 1,
    position: { x: '0%', y: 'auto' },  // bottom-anchored
    size: { w: '100%', h: '45%' },
    parallaxFactor: 0.06,
    breathingPhase: 1.1,
    breathingDuration: 8000,
    assembleDelay: 150,
    zIndex: 2,
  },

  // ── DEPTH 2: Couple ───────────────────────────────────────────
  {
    id: 'couple',
    type: 'couple',
    asset: 'couple/couple-standing.png',
    depthTier: 2,
    position: { x: '50%', y: '18%' },
    size: { w: '60%', h: 'auto' },
    parallaxFactor: 0.12,
    breathingPhase: 0.8,
    breathingDuration: 6000,
    assembleDelay: 450,
    blendMode: 'multiply',
    zIndex: 3,
  },

  // ── DEPTH 3: Cats (6 cats, each independent) ──────────────────
  // NOTE: The hero bg scene (5.png) already shows all cats as part of the bg.
  // The individual transparent cat PNGs are used for parallax independence.
  // Position them to overlap the cats in the bg scene.
  {
    id: 'cat-jiro',
    type: 'cat',
    asset: 'cats/cat-jiro.png',
    depthTier: 3,
    position: { x: '45%', y: '42%' },  // center — matching bg scene position
    size: { w: '28%', h: 'auto' },
    parallaxFactor: 0.24,
    breathingPhase: 0.4,
    breathingDuration: 5200,
    assembleDelay: 700,
    zIndex: 4,
  },
  {
    id: 'cat-moju',
    type: 'cat',
    asset: 'cats/cat-moju.png',
    depthTier: 3,
    position: { x: '8%', y: '52%' },   // far left — Moju lounging
    size: { w: '22%', h: 'auto' },
    parallaxFactor: 0.20,
    breathingPhase: 2.1,
    breathingDuration: 7000,
    assembleDelay: 750,
    blendMode: 'multiply',
    zIndex: 4,
  },
  {
    id: 'cat-shiro',
    type: 'cat',
    asset: 'cats/cat-shiro.png',
    depthTier: 3,
    position: { x: '30%', y: '55%' },   // center-left — small kitten
    size: { w: '16%', h: 'auto' },
    parallaxFactor: 0.28,
    breathingPhase: 1.5,
    breathingDuration: 4500,
    assembleDelay: 800,
    blendMode: 'multiply',
    zIndex: 4,
  },
  {
    id: 'cat-simba',
    type: 'cat',
    asset: 'cats/cat-simba.png',
    depthTier: 3,
    position: { x: '62%', y: '50%' },   // center-right — leaning forward
    size: { w: '20%', h: 'auto' },
    parallaxFactor: 0.22,
    breathingPhase: 3.2,
    breathingDuration: 6500,
    assembleDelay: 830,
    blendMode: 'multiply',
    zIndex: 4,
  },
  {
    id: 'cat-hoshi',
    type: 'cat',
    asset: 'cats/cat-hoshi.png',
    depthTier: 3,
    position: { x: '78%', y: '45%' },   // right — tabby sitting
    size: { w: '18%', h: 'auto' },
    parallaxFactor: 0.30,
    breathingPhase: 0.9,
    breathingDuration: 5800,
    assembleDelay: 870,
    blendMode: 'multiply',
    zIndex: 4,
  },
  {
    id: 'cat-kimho',
    type: 'cat',
    asset: 'cats/cat-kimho.png',
    depthTier: 3,
    position: { x: '18%', y: '48%' },   // left-center tabby
    size: { w: '19%', h: 'auto' },
    parallaxFactor: 0.26,
    breathingPhase: 2.7,
    breathingDuration: 6200,
    assembleDelay: 910,
    blendMode: 'multiply',
    zIndex: 4,
  },

  // ── DEPTH 4: Foreground florals ───────────────────────────────
  {
    id: 'vine-left',
    type: 'floral',
    asset: 'florals/vine-left.png',
    depthTier: 4,
    position: { x: '-2%', y: '10%' },
    size: { w: '22%', h: 'auto' },
    parallaxFactor: 0.50,
    breathingPhase: 1.8,
    breathingDuration: 7500,
    assembleDelay: 1050,
    zIndex: 5,
  },
  {
    id: 'vine-right',
    type: 'floral',
    asset: 'florals/vine-left.png',  // mirror via CSS scaleX(-1)
    depthTier: 4,
    position: { x: '80%', y: '10%' },
    size: { w: '22%', h: 'auto' },
    parallaxFactor: 0.50,
    breathingPhase: 0.6,
    breathingDuration: 6800,
    assembleDelay: 1060,
    zIndex: 5,
  },
  {
    id: 'garland-top',
    type: 'floral',
    asset: 'florals/garland-swag.png',
    depthTier: 4,
    position: { x: '10%', y: '-2%' },
    size: { w: '80%', h: 'auto' },
    parallaxFactor: 0.45,
    breathingPhase: 2.4,
    breathingDuration: 8500,
    assembleDelay: 1080,
    zIndex: 5,
  },
]

// Text layer (no parallax factor — always viewport-anchored)
export const heroText = {
  id: 'hero-text',
  type: 'text' as const,
  assembleDelay: 1350,
  zIndex: 10,
}
```

---

## 3. `HeroSection/index.tsx` — Main Orchestrator

```typescript
// components/HeroSection/index.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { heroLayers } from './heroLayout.config'
import HeroLayer from './HeroLayer'
import HeroText from './HeroText'
import ParticleCanvas from './ParticleCanvas'
import DovesPath from './DovesPath'
import ButterfliesPath from './ButterfliesPath'
import { useGyroParallax } from './useGyroParallax'
import { useScrollParallax } from './useScrollParallax'
import { useMotionTier } from '@/components/MotionProvider'
import styles from './hero.module.css'

gsap.registerPlugin(ScrollTrigger)

interface HeroSectionProps {
  triggerAssemble: boolean   // set to true when gate transition completes
  guestName: string
}

export default function HeroSection({ triggerAssemble, guestName }: HeroSectionProps) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const layerRefs     = useRef<Record<string, HTMLDivElement | null>>({})
  const idleLoopsRef  = useRef<gsap.core.Tween[]>([])
  const tier          = useMotionTier()

  const { gyroOffset } = useGyroParallax(tier)
  useScrollParallax(containerRef, layerRefs, tier)

  // ── ASSEMBLE TIMELINE ──────────────────────────────────────────
  useEffect(() => {
    if (!triggerAssemble || !containerRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        startIdleLoops()
        // Remove will-change after assemble to free GPU memory
        Object.values(layerRefs.current).forEach(el => {
          if (el) el.style.willChange = 'auto'
        })
      }
    })

    // t=0   Background
    tl.fromTo(`#layer-bg-texture, #layer-hero-bg`,
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1, duration: 1.0, ease: 'power2.out' }, 0)

    // t=0.15 Ground
    tl.fromTo(`#layer-meadow-fg`,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, 0.15)

    // t=0.45 Couple
    tl.fromTo(`#layer-couple`,
      { opacity: 0, y: 40, scale: 0.96 },
      { opacity: 1, y: 0,  scale: 1, duration: 0.8, ease: 'back.out(1.2)' }, 0.45)

    // t=0.70 Cats (stagger 100ms each, in order: Jiro first → Kimho last)
    const catIds = ['cat-jiro','cat-moju','cat-shiro','cat-simba','cat-hoshi','cat-kimho']
    catIds.forEach((id, i) => {
      tl.fromTo(`#layer-${id}`,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0,  scale: 1, duration: 0.7, ease: 'back.out(1.4)' },
        0.70 + i * 0.10)
    })

    // t=1.05 Foreground florals
    tl.fromTo(`#layer-vine-left`,
      { opacity: 0, scale: 1.08, transformOrigin: 'bottom left' },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 1.05)
    tl.fromTo(`#layer-vine-right`,
      { opacity: 0, scale: 1.08, transformOrigin: 'bottom right' },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 1.07)
    tl.fromTo(`#layer-garland-top`,
      { opacity: 0, scale: 1.06 },
      { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, 1.08)

    // t=1.20 Doves begin MotionPath flight
    tl.call(() => {
      const doves = document.getElementById('doves-path')
      if (doves) doves.style.visibility = 'visible'
    }, [], 1.20)

    // t=1.25 Butterflies appear
    tl.call(() => {
      const butterflies = document.getElementById('butterflies-path')
      if (butterflies) butterflies.style.visibility = 'visible'
    }, [], 1.25)

    // t=1.30 Particle system
    tl.call(() => {
      const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement
      if (canvas) canvas.dataset.active = 'true'
    }, [], 1.30)

    // t=1.35 Text stagger
    tl.fromTo('.hero-text-line',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }, 1.35)

  }, [triggerAssemble])

  // ── IDLE LOOPS (breathing) ─────────────────────────────────────
  function startIdleLoops() {
    if (tier === 'LOW' || tier === 'REDUCED') return

    // Background slow cloud drift (horizontal yoyo)
    idleLoopsRef.current.push(
      gsap.to('#layer-hero-bg', {
        x: '-2%', duration: 30,
        yoyo: true, repeat: -1, ease: 'sine.inOut'
      })
    )

    // Couple breathing
    idleLoopsRef.current.push(
      gsap.to('#layer-couple', {
        y: '±3px', scale: 1.012,
        duration: 6, yoyo: true, repeat: -1,
        ease: 'sine.inOut'
      })
    )

    // Each cat: unique phase & duration
    heroLayers.filter(l => l.type === 'cat').forEach(cat => {
      const el = document.getElementById(`layer-${cat.id}`)
      if (!el) return

      // Main breathing loop
      gsap.to(el, {
        y: `${-2 - Math.random() * 2}px`,
        scale: 1 + 0.008 + Math.random() * 0.004,
        duration: cat.breathingDuration / 1000,
        yoyo: true, repeat: -1,
        ease: 'sine.inOut',
        delay: cat.breathingPhase * 0.5   // stagger start using phase
      })

      // Occasional settle shift (every 6–12s random)
      const settleInterval = () => {
        const wait = 6000 + Math.random() * 6000
        setTimeout(() => {
          gsap.to(el, {
            x: `${(Math.random() - 0.5) * 3}px`,
            duration: 0.8, ease: 'back.out(1.5)',
            yoyo: true, repeat: 1,
            onComplete: settleInterval
          })
        }, wait)
      }
      settleInterval()

      // Occasional glance (every ~15s)
      if (tier === 'HIGH') {
        const glanceInterval = () => {
          setTimeout(() => {
            gsap.to(el, {
              rotation: (Math.random() - 0.5) * 1.6,
              duration: 0.6, ease: 'sine.inOut',
              yoyo: true, repeat: 1,
              onComplete: glanceInterval
            })
          }, 12000 + Math.random() * 6000)
        }
        glanceInterval()
      }
    })

    // Foreground floral sway (rotate around base)
    ;['vine-left', 'vine-right'].forEach((id, i) => {
      gsap.to(`#layer-${id}`, {
        rotation: i === 0 ? 1.2 : -1.2,
        transformOrigin: 'bottom center',
        duration: 7 + i,
        yoyo: true, repeat: -1, ease: 'sine.inOut',
        delay: i * 1.5
      })
    })
    gsap.to('#layer-garland-top', {
      rotation: 0.6, duration: 8.5,
      yoyo: true, repeat: -1, ease: 'sine.inOut'
    })
  }

  // ── GYRO APPLY ─────────────────────────────────────────────────
  useEffect(() => {
    heroLayers.forEach(layer => {
      const el = document.getElementById(`layer-${layer.id}`)
      if (!el) return
      const ox = gyroOffset.x * 40 * layer.parallaxFactor
      const oy = gyroOffset.y * 24 * layer.parallaxFactor
      // Apply without overriding GSAP breathing — use CSS custom properties
      el.style.setProperty('--gyro-x', `${ox}px`)
      el.style.setProperty('--gyro-y', `${oy}px`)
    })
  }, [gyroOffset])

  // ── LOW TIER: flat image only ──────────────────────────────────
  if (tier === 'LOW') {
    return (
      <section className={styles.heroSection} ref={containerRef}>
        <img src="/assets/scenes/hero-bg.png" alt="" className={styles.heroBgFlat} />
        <HeroText guestName={guestName} />
      </section>
    )
  }

  return (
    <section className={styles.heroSection} ref={containerRef} id="hero">
      {heroLayers.map(layer => (
        <HeroLayer
          key={layer.id}
          config={layer}
          ref={el => { layerRefs.current[layer.id] = el }}
        />
      ))}
      <HeroText guestName={guestName} />
      <DovesPath tier={tier} />
      <ButterfliesPath tier={tier} />
      {tier !== 'REDUCED' && <ParticleCanvas tier={tier} />}
    </section>
  )
}
```

---

## 4. `HeroLayer.tsx` — Generic Layer Wrapper

```typescript
// components/HeroSection/HeroLayer.tsx
import { forwardRef } from 'react'
import Image from 'next/image'
import { LayerConfig } from './heroLayout.config'
import styles from './hero.module.css'

interface Props { config: LayerConfig }

const HeroLayer = forwardRef<HTMLDivElement, Props>(({ config }, ref) => {
  const isFlipped = config.id === 'vine-right'

  return (
    <div
      ref={ref}
      id={`layer-${config.id}`}
      className={styles.heroLayer}
      style={{
        position: 'absolute',
        left: config.position.x,
        top:  config.position.y === 'auto' ? undefined : config.position.y,
        bottom: config.position.y === 'auto' ? 0 : undefined,
        width: config.size.w,
        height: config.size.h === 'auto' ? undefined : config.size.h,
        zIndex: config.zIndex,
        willChange: 'transform, opacity',
        transform: `
          translateX(var(--gyro-x, 0px))
          translateY(var(--gyro-y, 0px))
          scaleX(${isFlipped ? -1 : 1})
        `,
        opacity: 0,   // GSAP animates this in
        mixBlendMode: config.blendMode as any ?? 'normal',
      }}
    >
      <Image
        src={`/assets/${config.asset}`}
        alt=""
        fill={config.size.h !== 'auto'}
        width={config.size.h === 'auto' ? 600 : undefined}
        height={config.size.h === 'auto' ? 400 : undefined}
        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
        priority={config.depthTier <= 1}
      />
    </div>
  )
})
HeroLayer.displayName = 'HeroLayer'
export default HeroLayer
```

---

## 5. `hero.module.css`

```css
/* hero.module.css */
.heroSection {
  position: relative;
  width: 100%;
  height: 100svh;       /* safe viewport height (iOS) */
  overflow: hidden;
  background: var(--color-cream);
}

.heroLayer {
  transition: transform 0.1s linear;   /* gyro lerp feels smooth */
}

/* LOW tier flat fallback */
.heroBgFlat {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
}

/* CSS breathing applied via inline --animation-duration variable */
.breathingElement {
  animation: breathing var(--breathing-dur, 5000ms) ease-in-out infinite;
  animation-delay: var(--breathing-phase, 0ms);
}

@keyframes breathing {
  0%, 100% { transform: translateY(0)    scale(1);     }
  50%       { transform: translateY(-3px) scale(1.012); }
}

/* Drapery ripple (for dividers) */
@keyframes draperyRipple {
  0%, 100% { mask-position: 0% 50%;   transform: scaleY(1);      }
  50%       { mask-position: 100% 50%; transform: scaleY(1.003);  }
}

/* Scroll exit — hero fades as next section arrives */
.heroSection[data-scrolling="true"] {
  /* ScrollTrigger handles opacity on individual layers */
}
```

---

## 6. `useGyroParallax.ts` — DeviceOrientation with Lerp

```typescript
// components/HeroSection/useGyroParallax.ts
import { useState, useEffect, useRef } from 'react'
import type { MotionTier } from '@/components/MotionProvider/types'

interface GyroOffset { x: number; y: number }

export function useGyroParallax(tier: MotionTier) {
  const [gyroOffset, setGyroOffset] = useState<GyroOffset>({ x: 0, y: 0 })
  const target   = useRef<GyroOffset>({ x: 0, y: 0 })
  const current  = useRef<GyroOffset>({ x: 0, y: 0 })
  const rafId    = useRef<number>()
  const SMOOTH   = 0.08   // lerp factor — prevents shakiness

  useEffect(() => {
    if (tier === 'LOW' || tier === 'REDUCED') return
    if (sessionStorage.getItem('gyro_granted') !== '1') {
      startCssDrift()   // fallback: CSS auto-drift on layers (no JS)
      return
    }

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0   // left/right tilt: -90 to +90
      const beta  = e.beta  ?? 0   // front/back tilt: -180 to +180
      // Clamp to ±20° and normalize to -1..1
      target.current = {
        x: Math.max(-1, Math.min(1, gamma / 20)),
        y: Math.max(-1, Math.min(1, (beta - 45) / 20)), // subtract 45° natural hold angle
      }
    }

    const loop = () => {
      // Lerp current → target
      current.current.x += (target.current.x - current.current.x) * SMOOTH
      current.current.y += (target.current.y - current.current.y) * SMOOTH
      setGyroOffset({ ...current.current })
      rafId.current = requestAnimationFrame(loop)
    }

    window.addEventListener('deviceorientation', handleOrientation, { passive: true })
    rafId.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [tier])

  return { gyroOffset }
}

function startCssDrift() {
  // Inject CSS auto-drift class — each layer oscillates independently
  document.documentElement.classList.add('gyro-css-fallback')
}
```

---

## 7. `useScrollParallax.ts` — GSAP ScrollTrigger Per Layer

```typescript
// components/HeroSection/useScrollParallax.ts
import { useEffect, RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { heroLayers } from './heroLayout.config'
import type { MotionTier } from '@/components/MotionProvider/types'

gsap.registerPlugin(ScrollTrigger)

export function useScrollParallax(
  containerRef: RefObject<HTMLDivElement>,
  layerRefs: RefObject<Record<string, HTMLDivElement | null>>,
  tier: MotionTier
) {
  useEffect(() => {
    if (!containerRef.current || tier === 'LOW') return

    const ctx = gsap.context(() => {
      heroLayers.forEach(layer => {
        const el = layerRefs.current?.[layer.id]
        if (!el) return

        // Scroll: far layers (low parallaxFactor) barely move; near layers fly
        const yOffset = -80 * layer.parallaxFactor

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress
            gsap.set(el, { y: yOffset * p })

            // Text fades first, sky last
            if (layer.type === 'text') {
              gsap.set(el, { opacity: 1 - p * 1.6 })
            } else if (layer.type === 'bg') {
              gsap.set(el, { opacity: 1 - p * 0.6 })
            } else {
              gsap.set(el, { opacity: 1 - p * 1.1 })
            }
          }
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [containerRef, layerRefs, tier])
}
```

---

## 8. `ParticleCanvas.tsx` — RAF Loop for Petals

```typescript
// components/HeroSection/ParticleCanvas.tsx
'use client'
import { useRef, useEffect } from 'react'
import type { MotionTier } from '@/components/MotionProvider/types'

interface Particle {
  x: number; y: number
  vx: number; vy: number        // pixels per second
  size: number                  // 6–16px
  rot: number; vrot: number
  swayPhase: number
  opacity: number
  color: string
}

const COLORS = ['#F3D9D6', '#F5C9AA', '#FBF7F0', '#D9A7A0', '#F3E9DC']
const DENSITY: Record<MotionTier, number> = {
  HIGH: 13, MID: 6, LOW: 0, REDUCED: 0
}

function makeParticle(w: number): Particle {
  return {
    x: Math.random() * w,
    y: -20,
    vx: (Math.random() - 0.5) * 15,
    vy: 8 + Math.random() * 12,
    size: 6 + Math.random() * 10,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.8,
    swayPhase: Math.random() * Math.PI * 2,
    opacity: 0.6 + Math.random() * 0.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }
}

interface Props { tier: MotionTier }

export default function ParticleCanvas({ tier }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const rafId     = useRef<number>()
  const lastTime  = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || tier === 'LOW' || tier === 'REDUCED') return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Spawn initial particles
    const count = DENSITY[tier]
    while (particles.current.length < count) {
      const p = makeParticle(canvas.width)
      p.y = Math.random() * canvas.height   // scatter initial y
      particles.current.push(p)
    }

    const draw = (timestamp: number) => {
      if (!canvas.dataset.active) {
        rafId.current = requestAnimationFrame(draw)
        return
      }

      const dt = Math.min((timestamp - lastTime.current) / 1000, 0.05)  // cap at 50ms
      lastTime.current = timestamp

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current.forEach((p, i) => {
        // Update position
        p.y   += p.vy * dt
        p.x   += p.vx * dt + Math.sin(p.swayPhase + timestamp * 0.0005) * 20 * dt
        p.rot += p.vrot * dt

        // Fade near bottom
        const fadeStart = canvas.height * 0.85
        const fadeAlpha = p.y > fadeStart
          ? p.opacity * (1 - (p.y - fadeStart) / (canvas.height * 0.15))
          : p.opacity

        // Draw petal (oval rotated)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = Math.max(0, fadeAlpha)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.7, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Recycle when off screen
        if (p.y > canvas.height + 20 || p.x < -50 || p.x > canvas.width + 50) {
          particles.current[i] = makeParticle(canvas.width)
        }
      })

      // Maintain count
      while (particles.current.length < DENSITY[tier]) {
        particles.current.push(makeParticle(canvas.width))
      }

      rafId.current = requestAnimationFrame(draw)
    }

    // Pause on visibility change
    const onVisibility = () => {
      if (document.hidden) {
        if (rafId.current) cancelAnimationFrame(rafId.current)
      } else {
        lastTime.current = 0
        rafId.current = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    rafId.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [tier])

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      data-active=""
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 6,
      }}
      aria-hidden
    />
  )
}
```

---

## 9. `DovesPath.tsx` — MotionPath Animation

Uses `doves/doves-flying.png` — two cream doves mid-flight, transparent.

```typescript
// components/HeroSection/DovesPath.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import Image from 'next/image'
import type { MotionTier } from '@/components/MotionProvider/types'

gsap.registerPlugin(MotionPathPlugin)

interface Props { tier: MotionTier }

export default function DovesPath({ tier }: Props) {
  const doveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (tier === 'LOW' || tier === 'REDUCED') return
    const el = doveRef.current
    if (!el) return

    const flyLoop = () => {
      const dur = 12 + Math.random() * 4
      const yVariance = (Math.random() - 0.5) * 60

      gsap.fromTo(el,
        { x: '-10vw', y: `${20 + yVariance}vh`, opacity: 0, scale: 0.6 },
        {
          motionPath: {
            path: [
              { x: '25vw', y: `${15 + yVariance}vh` },
              { x: '55vw', y: `${10 + yVariance}vh` },
              { x: '80vw', y: `${18 + yVariance}vh` },
              { x: '110vw', y: `${12 + yVariance}vh` },
            ],
            curviness: 1.4,
          },
          opacity: 1,
          scale: 0.9,
          duration: dur,
          ease: 'sine.inOut',
          onComplete: () => {
            gsap.set(el, { opacity: 0 })
            setTimeout(flyLoop, 3000 + Math.random() * 2000)
          }
        }
      )
    }

    // Initial delay before first flight
    setTimeout(flyLoop, 1200)
  }, [tier])

  return (
    <div
      ref={doveRef}
      id="doves-path"
      style={{ position: 'absolute', visibility: 'hidden', zIndex: 7, width: 80 }}
      aria-hidden
    >
      <Image
        src="/assets/doves/doves-flying.png"
        alt=""
        width={80}
        height={60}
        style={{ opacity: 0.9 }}
      />
    </div>
  )
}
```

---

## 10. `ButterfliesPath.tsx` — Bezier Drift + Wing Flutter

Uses `butterflies/butterflies-pair.png` — two small pink blush butterflies.

```typescript
// components/HeroSection/ButterfliesPath.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import type { MotionTier } from '@/components/MotionProvider/types'

interface Props { tier: MotionTier }

export default function ButterfliesPath({ tier }: Props) {
  const bfRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (tier === 'LOW' || tier === 'REDUCED') return
    const el  = bfRef.current
    const img = imgRef.current
    if (!el || !img) return

    // Wing flutter: scaleX 1 ↔ 0.82 every 180ms
    if (tier === 'HIGH') {
      gsap.to(img, {
        scaleX: 0.82, duration: 0.18,
        yoyo: true, repeat: -1, ease: 'sine.inOut'
      })
    }

    // Bezier drift near florals
    const drift = () => {
      const tx = 10 + Math.random() * 60  // % of viewport
      const ty = 20 + Math.random() * 40
      gsap.to(el, {
        x: `${tx}vw`, y: `${ty}vh`,
        duration: 4 + Math.random() * 3,
        ease: 'sine.inOut',
        onComplete: drift
      })
    }

    gsap.set(el, { x: '30vw', y: '25vh' })
    drift()
  }, [tier])

  return (
    <div
      ref={bfRef}
      id="butterflies-path"
      style={{ position: 'absolute', visibility: 'hidden', zIndex: 7, width: 48 }}
      aria-hidden
    >
      <Image
        ref={imgRef}
        src="/assets/butterflies/butterflies-pair.png"
        alt=""
        width={48}
        height={36}
      />
    </div>
  )
}
```

---

## 11. `HeroText.tsx` — Names, Date, Hashtag

```typescript
// components/HeroSection/HeroText.tsx
import styles from './hero.module.css'

interface Props { guestName: string }

export default function HeroText({ guestName }: Props) {
  return (
    <div className={styles.heroTextOverlay} aria-live="polite">
      {guestName && (
        <p className={`${styles.heroTextLine} hero-text-line`} style={{ fontSize: '0.75rem', letterSpacing: '0.3em' }}>
          Kepada {guestName}
        </p>
      )}
      <p className={`${styles.heroTextLine} ${styles.heroNames} hero-text-line`}>
        Bashara & Aina
      </p>
      <p className={`${styles.heroTextLine} ${styles.heroDate} hero-text-line`}>
        Ahad, 26 Oktober 2025
      </p>
      <p className={`${styles.heroTextLine} ${styles.heroHashtag} hero-text-line`}>
        #BukaSebuahCerita
      </p>
    </div>
  )
}

/* In hero.module.css: */
/*
.heroTextOverlay {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
  pointer-events: none;
}
.heroTextLine { opacity: 0; }   ← GSAP animates these
.heroNames {
  font-family: var(--font-script);
  font-size: clamp(2.2rem, 8vw, 3.5rem);
  color: var(--color-ink);
  line-height: 1.1;
}
.heroDate {
  font-family: var(--font-serif);
  font-size: clamp(0.85rem, 3vw, 1.1rem);
  color: var(--color-muted);
  letter-spacing: 0.15em;
  margin-top: 8px;
}
.heroHashtag {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: var(--color-dusty);
  letter-spacing: 0.2em;
  margin-top: 6px;
}
*/
```

---

## 12. Asset Copy Script

```bash
#!/bin/bash
# Run from project root
SRC="Recovered/correct/most correct"
PUB="public/assets"

mkdir -p "$PUB/scenes" "$PUB/cats" "$PUB/florals" "$PUB/doves" "$PUB/butterflies" "$PUB/couple"

# Scenes
cp "$SRC/5.png"        "$PUB/scenes/hero-bg.png"
cp "$SRC/17.png"       "$PUB/scenes/bg-texture.png"

# Cats
cp "$SRC/png asset website 2/9.png"  "$PUB/cats/cat-jiro.png"
cp "$SRC/png asset website 2/3.png"  "$PUB/cats/cat-moju.png"
cp "$SRC/png asset website 2/4.png"  "$PUB/cats/cat-shiro.png"
cp "$SRC/png asset website 2/5.png"  "$PUB/cats/cat-simba.png"
cp "$SRC/png asset website 2/6.png"  "$PUB/cats/cat-hoshi.png"
cp "$SRC/png asset website 2/7.png"  "$PUB/cats/cat-kimho.png"
cp "$SRC/png asset website 2/8.png"  "$PUB/cats/cat-shiro-peek.png"
cp "$SRC/14.png"       "$PUB/cats/cat-simba-dove.png"
cp "$SRC/27.png"       "$PUB/cats/cats-trio-doves.png"

# Couple
cp "$SRC/png asset website 2/10.png" "$PUB/couple/couple-standing.png"

# Florals
cp "$SRC/2.png"        "$PUB/florals/meadow-fg.png"
cp "$SRC/20.png"       "$PUB/florals/meadow-fg-2.png"
cp "$SRC/6.png"        "$PUB/florals/vine-left.png"
cp "$SRC/7.png"        "$PUB/florals/garland-swag.png"

# Doves & butterflies
cp "$SRC/png asset website 2/15.png" "$PUB/doves/doves-flying.png"
cp "$SRC/png asset website 2/17.png" "$PUB/butterflies/butterflies-pair.png"
```

---

## 13. Performance Tier Gate Summary

| Feature | HIGH | MID | LOW | REDUCED |
|---|---|---|---|---|
| Gyro parallax | ✓ | ✓ | ✗ | ✗ |
| Individual cat layers | ✓ | ✓ | flat img | flat img |
| Particle canvas | 13 petals | 6 petals | ✗ | ✗ |
| Idle breathing loops | ✓ | ✓ | ✗ | ✗ |
| Cat glance animation | ✓ | ✗ | ✗ | ✗ |
| Doves MotionPath | ✓ | ✓ | ✗ | ✗ |
| Butterfly wing flutter | ✓ | ✗ | ✗ | ✗ |
| will-change cleanup | after assemble | after assemble | n/a | n/a |
