# IMPL-04 — The Breath (ACT 3: AMBIENT LAYER)

> "The world never stops being alive. Every section is part of the same living world."

---

## 0. Asset Map for This File

| File in `/public/assets/` | Source | Role |
|---|---|---|
| `doves/doves-flying.png` | `png asset website 2/15.png` | Ambient dove flyovers (post-hero) |
| `butterflies/butterflies-pair.png` | `png asset website 2/17.png` | Ambient butterfly drifts |
| `florals/sakura-scatter.png` | `25.png` | Japan section particle color source |
| `dividers/drapery.png` | `18.png` | Drapery divider — has its own ripple CSS |

Particles are procedurally drawn on canvas — no additional image files needed for them.

---

## 1. Architecture Overview

`AmbientLayer` is a single non-visual wrapper component that renders:
1. One fixed `<canvas>` for particles (behind text, above backgrounds)
2. Periodic ambient dove flyover elements (absolutely positioned, GSAP MotionPath)
3. The persistent audio toggle button (sticky, top-right)
4. The scroll progress bar (top viewport edge)
5. A `useAmbientBreathing` hook that assigns random CSS duration variables to all illustration images on the page

```
AmbientLayer/
  index.tsx               ← wraps entire page, mounts all ambient systems
  ParticleCanvas.tsx      ← fixed viewport canvas (different from hero canvas)
  AmbientDoves.tsx        ← post-hero periodic dove flyovers
  AudioControl.tsx        ← sticky audio toggle, breathing idle animation
  ScrollProgress.tsx      ← 2px progress line at viewport top
  useAmbientBreathing.ts  ← assigns random durations to all .breathing-element
```

---

## 2. `AmbientLayer/index.tsx`

```typescript
// components/AmbientLayer/index.tsx
'use client'
import { useEffect } from 'react'
import ParticleCanvas    from './ParticleCanvas'
import AmbientDoves      from './AmbientDoves'
import AudioControl      from './AudioControl'
import ScrollProgress    from './ScrollProgress'
import { useAmbientBreathing } from './useAmbientBreathing'
import { useMotionTier } from '@/components/MotionProvider'

interface Props { children: React.ReactNode }

export default function AmbientLayer({ children }: Props) {
  const tier = useMotionTier()
  useAmbientBreathing(tier)

  return (
    <>
      {/* Scroll progress — top of viewport */}
      {(tier !== 'LOW' && tier !== 'REDUCED') && <ScrollProgress />}

      {/* Ambient particle canvas — fixed, behind all content */}
      {(tier !== 'LOW' && tier !== 'REDUCED') && <ParticleCanvas tier={tier} />}

      {/* Page content */}
      {children}

      {/* Post-hero ambient doves */}
      {(tier !== 'LOW' && tier !== 'REDUCED') && <AmbientDoves tier={tier} />}

      {/* Persistent audio control */}
      <AudioControl />
    </>
  )
}
```

---

## 3. `ParticleCanvas.tsx` — Ambient Fixed Canvas

This is the **page-level** particle canvas, distinct from the hero canvas (IMPL-02). It is fixed to the viewport and persists across all sections. It pauses when off-screen via `IntersectionObserver` on a sentinel element.

```typescript
// components/AmbientLayer/ParticleCanvas.tsx
'use client'
import { useRef, useEffect, useCallback } from 'react'
import type { MotionTier } from '@/components/MotionProvider/types'

// ── Particle Type ──────────────────────────────────────────────
interface Particle {
  x: number
  y: number
  vx: number            // horizontal drift (pixels/second)
  vy: number            // fall speed (pixels/second) — 8–20
  size: number          // 6–16px
  rot: number           // current rotation (radians)
  vrot: number          // rotation velocity (rad/sec)
  swayPhase: number     // unique phase for sine sway
  opacity: number       // 0.4–1.0
  color: string         // from active palette
}

// ── Palettes ───────────────────────────────────────────────────
const PALETTE_DEFAULT = ['#F3D9D6', '#F5C9AA', '#FBF7F0', '#D9A7A0', '#F3E9DC', '#EBC8C4']
const PALETTE_SAKURA  = ['#FFCAD4', '#FFB3C1', '#FFC8DD', '#FBF7F0', '#FFD6E0', '#FFAAB5']

// ── Count by tier ──────────────────────────────────────────────
const DENSITY: Record<MotionTier, number> = {
  HIGH: 12, MID: 5, LOW: 0, REDUCED: 0,
}

// ── Shared mutable state (module-level to survive re-renders) ──
let colorOverride: string[] | null = null
let countExtra = 0

// Called from StorySection CH.3 via CustomEvent
if (typeof window !== 'undefined') {
  window.addEventListener('section-enter', ((e: CustomEvent) => {
    if (e.detail.section === 'japan') {
      colorOverride = PALETTE_SAKURA
      countExtra    = 2
    }
  }) as EventListener)
  window.addEventListener('section-exit', ((e: CustomEvent) => {
    if (e.detail.section === 'japan') {
      colorOverride = null
      countExtra    = 0
    }
  }) as EventListener)
}

function randomColor(palette: string[]): string {
  return palette[Math.floor(Math.random() * palette.length)]
}

function makeParticle(w: number, h?: number): Particle {
  const palette = colorOverride ?? PALETTE_DEFAULT
  return {
    x:          Math.random() * w,
    y:          h !== undefined ? h * Math.random() : -20,
    vx:         (Math.random() - 0.5) * 12,
    vy:         8 + Math.random() * 12,
    size:       6 + Math.random() * 10,
    rot:        Math.random() * Math.PI * 2,
    vrot:       (Math.random() - 0.5) * 0.8,
    swayPhase:  Math.random() * Math.PI * 2,
    opacity:    0.4 + Math.random() * 0.6,
    color:      randomColor(palette),
  }
}

interface Props { tier: MotionTier }

export default function ParticleCanvas({ tier }: Props) {
  const canvasRef     = useRef<HTMLCanvasElement>(null)
  const particles     = useRef<Particle[]>([])
  const rafId         = useRef<number>()
  const lastTime      = useRef<number>(0)
  const isPaused      = useRef<boolean>(false)

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas || isPaused.current) {
      rafId.current = requestAnimationFrame(draw)
      return
    }
    const ctx = canvas.getContext('2d')!
    const dt  = Math.min((timestamp - lastTime.current) / 1000, 0.05)
    lastTime.current = timestamp

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const targetCount = DENSITY[tier] + countExtra

    // Maintain particle count
    while (particles.current.length < targetCount) {
      particles.current.push(makeParticle(canvas.width))
    }
    while (particles.current.length > targetCount) {
      particles.current.pop()
    }

    particles.current.forEach((p, i) => {
      p.y   += p.vy * dt
      p.x   += p.vx * dt + Math.sin(p.swayPhase + timestamp * 0.0005) * 18 * dt
      p.rot += p.vrot * dt

      // Update color if override changed mid-flight
      if (colorOverride && !PALETTE_SAKURA.includes(p.color)) {
        p.color = randomColor(PALETTE_SAKURA)
      } else if (!colorOverride && !PALETTE_DEFAULT.includes(p.color)) {
        p.color = randomColor(PALETTE_DEFAULT)
      }

      // Fade near bottom
      const fadeStart = canvas.height * 0.85
      const alpha = p.y > fadeStart
        ? p.opacity * (1 - (p.y - fadeStart) / (canvas.height * 0.15))
        : p.opacity

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = Math.max(0, alpha)
      ctx.fillStyle   = p.color
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size * 0.35, p.size * 0.65, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Recycle off-screen
      if (p.y > canvas.height + 20 || p.x < -60 || p.x > canvas.width + 60) {
        particles.current[i] = makeParticle(canvas.width)
      }
    })

    rafId.current = requestAnimationFrame(draw)
  }, [tier])

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

    // Seed particles (scattered initial positions)
    const count = DENSITY[tier]
    while (particles.current.length < count) {
      particles.current.push(makeParticle(canvas.width, canvas.height))
    }

    // Pause on tab switch
    const onVisibility = () => {
      isPaused.current = document.hidden
      if (!document.hidden) lastTime.current = 0
    }
    document.addEventListener('visibilitychange', onVisibility)

    rafId.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [tier, draw])

  if (tier === 'LOW' || tier === 'REDUCED') return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,              // behind text (z=2+), above section backgrounds (z=0)
      }}
    />
  )
}
```

---

## 4. `useAmbientBreathing.ts` — CSS Breathing System

Runs once after mount. Queries all `[data-breathe]` elements and assigns unique CSS custom properties that drive the breathing keyframe duration and delay.

```typescript
// components/AmbientLayer/useAmbientBreathing.ts
import { useEffect } from 'react'
import type { MotionTier } from '@/components/MotionProvider/types'

export function useAmbientBreathing(tier: MotionTier) {
  useEffect(() => {
    if (tier === 'LOW' || tier === 'REDUCED') return

    // Use MutationObserver to catch elements added after initial render
    const assign = (root: Element | Document = document) => {
      root.querySelectorAll<HTMLElement>('[data-breathe]').forEach(el => {
        if (el.dataset.breatheInit === '1') return
        el.dataset.breatheInit = '1'

        const dur   = 4000 + Math.random() * 3000   // 4000–7000ms
        const delay = Math.random() * dur             // random start offset
        el.style.setProperty('--breathing-dur',   `${dur}ms`)
        el.style.setProperty('--breathing-delay', `${delay}ms`)
        el.classList.add('breathing-element')
      })
    }

    // Initial assignment
    assign()

    // Watch for new elements (lazy-rendered sections)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) assign(node as Element)
        })
      })
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => mo.disconnect()
  }, [tier])
}
```

**Add `data-breathe` to all illustration images:**
```tsx
// In StorySection:
<Image src={illustrationSrc} data-breathe="" ... />

// In DividerDrapery:
<Image ... data-breathe="" />

// In WelcomeSection:
<Image src="cats-banner.png" data-breathe="" ... />

// In ClosingSection:
<Image src="garland-cat.png" data-breathe="" ... />
```

**CSS breathing keyframe** (in `globals.css`):
```css
.breathing-element {
  animation: breathing var(--breathing-dur, 5500ms) ease-in-out infinite;
  animation-delay: calc(-1 * var(--breathing-delay, 0ms));   /* negative delay = random start phase */
}

@keyframes breathing {
  0%, 100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.009);
  }
}

/* Drapery divider specific ripple */
[data-breathe].drapery-img {
  animation: draperyRipple var(--breathing-dur, 8000ms) ease-in-out infinite;
}

@keyframes draperyRipple {
  0%, 100% {
    transform: scaleY(1) translateX(0%);
    mask-image: none;
  }
  50% {
    transform: scaleY(1.003) translateX(-1.2%);
  }
}

/* IntersectionObserver: pause breathing off-screen (in useAmbientBreathing or a companion hook) */
/* Implemented via paused state class: */
.breathing-element.breathing-paused {
  animation-play-state: paused;
}
```

**Pause off-screen breathing** (companion logic in `useAmbientBreathing.ts`):
```typescript
// After assigning, watch viewport for each breathing element
const pauseObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const el = entry.target as HTMLElement
      if (entry.isIntersecting) {
        el.classList.remove('breathing-paused')
      } else {
        el.classList.add('breathing-paused')
      }
    })
  },
  { rootMargin: '100px' }   // small buffer so it doesn't blink on edge
)
document.querySelectorAll('[data-breathe]').forEach(el => pauseObserver.observe(el))
// Store reference for cleanup...
```

---

## 5. `AmbientDoves.tsx` — Post-Hero Periodic Flyovers

After the hero exits viewport, doves periodically fly across whatever section is visible. Frequency: every ~20s (HIGH) or ~40s (MID).

```typescript
// components/AmbientLayer/AmbientDoves.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import Image from 'next/image'
import type { MotionTier } from '@/components/MotionProvider/types'

gsap.registerPlugin(MotionPathPlugin)

const FREQUENCY: Record<string, number> = { HIGH: 20000, MID: 40000 }

interface Props { tier: MotionTier }

export default function AmbientDoves({ tier }: Props) {
  const doveRef    = useRef<HTMLDivElement>(null)
  const heroExited = useRef(false)
  const timerRef   = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    // Only activate after hero section has scrolled out
    const heroEl = document.getElementById('hero')
    if (!heroEl) return

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          heroExited.current = true
          heroObserver.disconnect()
          scheduleNext()
        }
      },
      { threshold: 0.05 }
    )
    heroObserver.observe(heroEl)
    return () => heroObserver.disconnect()
  }, [tier])

  const flyAcross = () => {
    const el = doveRef.current
    if (!el) return

    const direction = Math.random() > 0.5 ? 1 : -1  // left-to-right or right-to-left
    const startX  = direction === 1 ? '-10vw' : '110vw'
    const endX    = direction === 1 ? '110vw' : '-10vw'
    const midX    = direction === 1 ? '50vw'  : '50vw'
    const yBase   = 20 + Math.random() * 50   // % of viewport height

    gsap.fromTo(el,
      { x: startX, y: `${yBase}vh`, opacity: 0, scale: 0.7,
        scaleX: direction === -1 ? -1 : 1 },
      {
        motionPath: {
          path: [
            { x: direction === 1 ? '25vw' : '75vw', y: `${yBase - 5}vh` },
            { x: midX,  y: `${yBase - 8}vh` },
            { x: direction === 1 ? '80vw' : '20vw', y: `${yBase - 3}vh` },
            { x: endX,  y: `${yBase}vh` },
          ],
          curviness: 1.5,
        },
        opacity: 0.9,
        scale: 0.85,
        duration: 5 + Math.random() * 3,
        ease: 'sine.inOut',
        onComplete: () => {
          gsap.set(el, { opacity: 0 })
          scheduleNext()
        }
      }
    )
  }

  const scheduleNext = () => {
    if (!heroExited.current) return
    const freq = FREQUENCY[tier] ?? 40000
    const jitter = (Math.random() - 0.5) * freq * 0.4
    timerRef.current = setTimeout(flyAcross, freq + jitter)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  if (tier === 'LOW' || tier === 'REDUCED') return null

  return (
    <div
      ref={doveRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: 'none',
        opacity: 0,
        width: 72,
        willChange: 'transform',
      }}
    >
      <Image
        src="/assets/doves/doves-flying.png"
        alt=""
        width={72}
        height={54}
        style={{ opacity: 0.85 }}
      />
    </div>
  )
}
```

---

## 6. `AudioControl.tsx` — Persistent Sticky Toggle

The audio element is the same one started during the gate tap (see IMPL-01 `audioSingleton.ts`). This component reads it and provides mute/unmute.

```typescript
// components/AmbientLayer/AudioControl.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { getAudio } from '@/utils/audioSingleton'
import styles from './audio.module.css'

export default function AudioControl() {
  const [muted, setMuted] = useState(false)
  const [visible, setVisible] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Show button once audio has started
  useEffect(() => {
    const checkAudio = setInterval(() => {
      if (getAudio()) { setVisible(true); clearInterval(checkAudio) }
    }, 200)
    return () => clearInterval(checkAudio)
  }, [])

  const toggle = () => {
    const audio = getAudio()
    if (!audio) return
    const nextMuted = !muted
    setMuted(nextMuted)

    if (nextMuted) {
      gsapFadeVolume(audio, audio.volume, 0, 400)
    } else {
      audio.play().catch(() => {})
      gsapFadeVolume(audio, audio.volume, 0.5, 400)
    }
  }

  if (!visible) return null

  return (
    <button
      ref={btnRef}
      className={`${styles.audioBtn} ${muted ? styles.muted : styles.playing}`}
      onClick={toggle}
      aria-label={muted ? 'Aktifkan musik' : 'Matikan musik'}
    >
      {/* Music note SVG */}
      <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden>
        <path
          d={muted
            ? 'M9 9v10l7-4-7-6zm9.5-4.5l-1.5 1.5M4 4l16 16'   // muted icon (X over note)
            : 'M9 18V5l12-2v13M6 21a3 3 0 0 0 3-3M18 19a3 3 0 0 0 3-3'  // music note
          }
          stroke="currentColor"
          strokeWidth={1.8}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

// Smooth volume fade utility
function gsapFadeVolume(audio: HTMLAudioElement, from: number, to: number, duration: number) {
  const start = performance.now()
  const fade = () => {
    const t = Math.min((performance.now() - start) / duration, 1)
    audio.volume = from + (to - from) * t
    if (t < 1) requestAnimationFrame(fade)
  }
  requestAnimationFrame(fade)
}
```

```css
/* audio.module.css */
.audioBtn {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid var(--color-blush);
  background: rgba(251, 247, 240, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-muted);
  animation: audioBreath 4s ease-in-out infinite;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.audioBtn:hover {
  background: rgba(243, 217, 214, 0.9);
  border-color: var(--color-dusty);
}
.muted {
  opacity: 0.6;
  animation: none;
}

@keyframes audioBreath {
  0%, 100% { transform: scale(1);    }
  50%       { transform: scale(1.03); }
}
```

---

## 7. `ScrollProgress.tsx` — 2px Top Bar

```typescript
// components/AmbientLayer/ScrollProgress.tsx
'use client'
import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const bar  = barRef.current
      if (!bar) return
      const doc   = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      const pct   = total > 0 ? (window.scrollY / total) * 100 : 0
      bar.style.transform = `scaleX(${pct / 100})`
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'transparent',
        zIndex: 200,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, var(--color-blush), var(--color-dusty))',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
```

---

## 8. Lenis Smooth Scroll Setup

Wrap the entire page in Lenis. All GSAP ScrollTriggers are automatically connected.

```typescript
// components/LenisProvider/index.tsx
'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props { children: React.ReactNode }

export default function LenisProvider({ children }: Props) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp:    0.09,
      smooth:  true,
      smoothTouch: false,   // keep native on touch to avoid jank
    })

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)   // disable lag smoothing — Lenis handles it

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tick)
    }
  }, [])

  return <>{children}</>
}
```

---

## 9. CSS Floral Accent Sway (Global)

All floral accent illustrations in story sections use a variant breathing that also includes subtle rotation around the base (mimicking a natural sway).

```css
/* In globals.css — sway variant */
[data-breathe="sway"] {
  animation: floralSway var(--breathing-dur, 6500ms) ease-in-out infinite;
  animation-delay: calc(-1 * var(--breathing-delay, 0ms));
  transform-origin: bottom center;
}

@keyframes floralSway {
  0%, 100% { transform: rotate(0deg)    scale(1);     }
  25%       { transform: rotate(1.2deg)  scale(1.005); }
  75%       { transform: rotate(-1.0deg) scale(1.008); }
}

/* Add data-breathe="sway" to: */
/* - vine-left/vine-right images */
/* - garland-swag */
/* - floral-corners */
/* - any standalone floral sprig PNG */
```

---

## 10. `globals.css` — Gyro CSS Fallback

When gyroscope is not available, layers auto-drift using pure CSS.

```css
/* Only active when .gyro-css-fallback is on <html> */
.gyro-css-fallback [data-depth="0"] {
  animation: autoDrift 25s ease-in-out infinite alternate;
}
.gyro-css-fallback [data-depth="1"] {
  animation: autoDrift 20s ease-in-out infinite alternate-reverse;
}
.gyro-css-fallback [data-depth="2"] {
  animation: autoDrift 18s ease-in-out infinite alternate;
}
.gyro-css-fallback [data-depth="3"] {
  animation: autoDrift 15s ease-in-out infinite alternate-reverse;
}
.gyro-css-fallback [data-depth="4"] {
  animation: autoDrift 12s ease-in-out infinite alternate;
}

@keyframes autoDrift {
  from { transform: translateX(-6px) translateY(-3px); }
  to   { transform: translateX(6px)  translateY(3px);  }
}
```

Add `data-depth={config.depthTier}` to each `HeroLayer` element.

---

## 11. Full Ambient System Behavior by Tier

| System | HIGH | MID | LOW | REDUCED |
|---|---|---|---|---|
| Particle canvas | 12 petals, section color override | 5 petals, no override | off | off |
| Ambient doves | every ~20s | every ~40s | off | off |
| CSS breathing | all elements, 4000–7000ms | all elements, 5000–7000ms | off | off |
| Drapery ripple | ✓ | ✓ | no animation | off |
| Floral sway | ✓ | ✓ | off | off |
| Audio | La Vie en Rose loop | same | same | same (audio always runs if unlocked) |
| Audio fade | ✓ volume ramp | ✓ | ✓ | ✓ |
| Scroll progress bar | ✓ | ✓ | off | off |
| Gyro parallax | ✓ | ✓ | off | off |
| CSS auto-drift fallback | if gyro denied | if gyro denied | off | off |

---

## 12. Event Communication Summary

All systems communicate via `CustomEvent` on `window` to stay decoupled.

```typescript
// Dispatched by StorySection CH.3 on enter:
window.dispatchEvent(new CustomEvent('section-enter', { detail: { section: 'japan' } }))

// Dispatched by StorySection CH.3 on exit:
window.dispatchEvent(new CustomEvent('section-exit', { detail: { section: 'japan' } }))

// Dispatched by HeroSection when assemble is done:
window.dispatchEvent(new CustomEvent('hero-alive'))

// AmbientDoves listens for:
// - hero IntersectionObserver exit (starts scheduling)

// AudioControl listens for:
// - audioSingleton.getAudio() polling (audio started by gate)
```

---

## 13. Installation Dependencies

```bash
npm install @studio-freight/lenis
npm install gsap           # includes MotionPathPlugin, ScrollTrigger
```

GSAP plugins must be registered once:
```typescript
// In a client-side singleton (e.g., components/gsapSetup.ts):
import gsap from 'gsap'
import { ScrollTrigger }   from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
```

---

## 14. Music Note Easter Egg (La Vie en Rose moment)

Triggered once per session at the Japan chapter entrance. A small animated note floats up from the audio button position.

```typescript
// components/AmbientLayer/MusicNote.tsx  (see IMPL-05 for full implementation)
// Trigger condition: Story CH.3 (Japan) enters viewport for the first time this session

// In StorySection for chapter 3:
useEffect(() => {
  if (chapter !== 3) return
  if (sessionStorage.getItem('music_note_shown')) return
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        sessionStorage.setItem('music_note_shown', '1')
        window.dispatchEvent(new CustomEvent('music-note-trigger'))
        observer.disconnect()
      }
    },
    { threshold: 0.4 }
  )
  if (ref.current) observer.observe(ref.current)
  return () => observer.disconnect()
}, [chapter])
```
