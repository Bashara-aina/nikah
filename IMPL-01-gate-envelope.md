# IMPL-01 — Gate & Envelope (ACT 0: THE RITUAL)

> "The guest doesn't open a website. They open an invitation."

---

## 0. Asset Map for This File

All assets referenced below live under `/public/assets/` after you copy them from the source folder.

| File in `/public/assets/` | Source | Description |
|---|---|---|
| `icons/cat-wreath-seal.png` | `png asset website 2/18.png` | Sleeping orange cat in a round floral wreath — used as the wax seal motif |
| `icons/doves-bouquet.png` | `png asset website 2/19.png` | Two cream doves perched on a rose bouquet — decorative on envelope back |
| `florals/garland-swag.png` | `7.png` | U-shaped pink/white floral garland swag — envelope bottom decoration |
| `florals/flower-line.png` | `10.png` | Delicate petal scatter line — inside envelope reveal |
| `dividers/drapery.png` | `18.png` | Cream drapery ribbon with flowers — reveals from envelope opening |
| `florals/petal-scatter.png` | `19.png` | Wispy petal scatter — ambient on gate screen |

---

## 1. Component Tree

```
src/
  app/
    page.tsx                    ← root: renders <GateScreen> or <MainPage> based on gate state
  components/
    GateScreen/
      index.tsx                 ← orchestrates state machine + transition
      Envelope.tsx              ← the visual envelope (CSS + SVG botanical corners)
      WaxSeal.tsx               ← animated circular seal with cat-wreath motif
      useGateTransition.ts      ← all side-effects: audio, gyro, sessionStorage, timing
      gate.module.css           ← ALL envelope animations (clip-path, flap, bloom)
    MotionProvider/
      index.tsx                 ← Context: tier detection on mount, stored on window.__motionTier
      types.ts                  ← export type MotionTier = 'HIGH' | 'MID' | 'LOW' | 'REDUCED'
```

---

## 2. Tier Detection (`MotionProvider`)

Run once at app mount, before the gate renders. Store result in React Context + `window.__motionTier`.

```typescript
// components/MotionProvider/index.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
export type MotionTier = 'HIGH' | 'MID' | 'LOW' | 'REDUCED'

function detectTier(): MotionTier {
  if (typeof window === 'undefined') return 'MID'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'REDUCED'
  const nav = navigator as any
  const cores = nav.hardwareConcurrency ?? 4
  const mem   = nav.deviceMemory    ?? 4   // GB, Chrome only
  const conn  = (nav.connection?.effectiveType) ?? '4g'
  if (conn === '2g' || conn === 'slow-2g' || mem <= 2 || cores <= 2) return 'LOW'
  if (mem <= 4 || cores <= 4) return 'MID'
  return 'HIGH'
}

const MotionCtx = createContext<MotionTier>('MID')
export const useMotionTier = () => useContext(MotionCtx)

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<MotionTier>('MID')
  useEffect(() => {
    const t = detectTier()
    setTier(t)
    ;(window as any).__motionTier = t
  }, [])
  return <MotionCtx.Provider value={tier}>{children}</MotionCtx.Provider>
}
```

---

## 3. Gate State Machine

The gate has 5 states. Only one transition path exists — forward only.

```
IDLE ──tap──► CRACKING ──250ms──► OPENING ──800ms──► BLOOMING ──400ms──► DONE
```

```typescript
// components/GateScreen/index.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import Envelope from './Envelope'
import { useGateTransition } from './useGateTransition'

type GateState = 'IDLE' | 'CRACKING' | 'OPENING' | 'BLOOMING' | 'DONE'

interface GateScreenProps {
  guestName: string
  onTransitionComplete: () => void
}

export default function GateScreen({ guestName, onTransitionComplete }: GateScreenProps) {
  const [state, setState] = useState<GateState>('IDLE')
  const { unlockAudio, requestGyro } = useGateTransition()

  const handleTap = useCallback(async () => {
    if (state !== 'IDLE') return
    setState('CRACKING')
    await unlockAudio()        // gesture-gated — MUST happen in tap handler
    await requestGyro()        // iOS 13+ DeviceOrientationEvent.requestPermission()
    setTimeout(() => setState('OPENING'),  250)
    setTimeout(() => setState('BLOOMING'), 250 + 800)
    setTimeout(() => {
      setState('DONE')
      onTransitionComplete()
    }, 250 + 800 + 400)
  }, [state, unlockAudio, requestGyro, onTransitionComplete])

  // Dismiss on state DONE — component unmounts from parent
  if (state === 'DONE') return null

  return (
    <div
      className="gate-root"
      data-state={state}
      onClick={handleTap}
      role="button"
      aria-label="Open your invitation"
    >
      <Envelope state={state} guestName={guestName} />
      {state === 'BLOOMING' && <div className="light-bloom" aria-hidden />}
    </div>
  )
}
```

---

## 4. Session Storage Gate-Skip

In `page.tsx` (root), check sessionStorage before rendering the gate at all.

```typescript
// app/page.tsx  (simplified)
'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import GateScreen from '@/components/GateScreen'
import MainPage   from '@/components/MainPage'

export default function Page() {
  const params = useSearchParams()
  const guestName = params.get('to') ?? ''          // ?to=NamaUndangan
  const [gateShown, setGateShown] = useState(false)  // pessimistic default (SSR)

  useEffect(() => {
    // Skip gate on refresh if already seen this session
    if (sessionStorage.getItem('gate_seen') === '1') {
      setGateShown(true)
    }
  }, [])

  const handleGateDone = () => {
    sessionStorage.setItem('gate_seen', '1')
    setGateShown(true)
  }

  if (gateShown) return <MainPage guestName={guestName} />
  return <GateScreen guestName={guestName} onTransitionComplete={handleGateDone} />
}
```

---

## 5. URL Param Parsing & Guest Name Fallback

```typescript
// utils/getGuestName.ts
export function getGuestName(raw: string | null): { name: string; isPersonalized: boolean } {
  if (!raw || raw.trim() === '') return { name: '', isPersonalized: false }
  // Decode URI component, capitalize first letter of each word
  const decoded = decodeURIComponent(raw.trim())
  const name = decoded.replace(/\b\w/g, c => c.toUpperCase())
  return { name, isPersonalized: true }
}

// Display logic in Envelope.tsx:
// isPersonalized → "Kepada, {name}" in the greeting
// !isPersonalized → "Kepada Tamu Undangan Terkasih"
```

---

## 6. `useGateTransition.ts` — Audio, Gyro, Timing

```typescript
// components/GateScreen/useGateTransition.ts
import { useRef } from 'react'

export function useGateTransition() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const unlockAudio = async () => {
    const audio = new Audio('/assets/audio/la-vie-en-rose.mp3')
    audio.loop   = true
    audio.volume = 0
    audioRef.current = audio
    try {
      await audio.play()
      // Fade in from 0 → 0.5 over 1200ms
      const start = performance.now()
      const fade = () => {
        const elapsed = performance.now() - start
        const progress = Math.min(elapsed / 1200, 1)
        audio.volume = progress * 0.5
        if (progress < 1) requestAnimationFrame(fade)
      }
      requestAnimationFrame(fade)
    } catch {
      // Autoplay blocked — audio will wait for next interaction (acceptable)
    }
    return audioRef
  }

  const requestGyro = async () => {
    if (typeof DeviceOrientationEvent === 'undefined') return
    const doe = DeviceOrientationEvent as any
    if (typeof doe.requestPermission === 'function') {
      try {
        const result = await doe.requestPermission()
        if (result === 'granted') {
          sessionStorage.setItem('gyro_granted', '1')
        }
      } catch {
        // User denied — gyro falls back to CSS auto-drift
      }
    } else {
      // Android / non-iOS — permission not required
      sessionStorage.setItem('gyro_granted', '1')
    }
  }

  return { unlockAudio, requestGyro, audioRef }
}
```

---

## 7. `Envelope.tsx` — Visual Spec

The envelope is built **entirely in CSS + inline SVG**. No images are required for the shape itself. The `cat-wreath-seal.png` is placed inside the SVG seal circle.

```typescript
// components/GateScreen/Envelope.tsx
import WaxSeal from './WaxSeal'
import styles from './gate.module.css'
import { getGuestName } from '@/utils/getGuestName'

type EnvelopeState = 'IDLE' | 'CRACKING' | 'OPENING' | 'BLOOMING' | 'DONE'

export default function Envelope({ state, guestName }: { state: EnvelopeState; guestName: string }) {
  const { name, isPersonalized } = getGuestName(guestName)

  return (
    <div className={`${styles.envelope} ${styles[`envelope--${state.toLowerCase()}`]}`}>
      {/* Triangular flap — clips open via CSS */}
      <div className={styles.envelopeFlap} aria-hidden />

      {/* Envelope body */}
      <div className={styles.envelopeBody}>
        {/* Botanical corner SVG — bottom-left */}
        <svg className={styles.botanicalBL} viewBox="0 0 80 80" aria-hidden>
          <g opacity="0.6">
            <path d="M5,75 Q20,50 40,40 Q25,60 10,70 Z" fill="#A9B89A" />
            <ellipse cx="38" cy="42" rx="4" ry="7" fill="#F3D9D6" transform="rotate(-30 38 42)" />
            <ellipse cx="28" cy="52" rx="3" ry="5" fill="#F5C9AA" transform="rotate(-45 28 52)" />
            <circle cx="15" cy="67" r="4" fill="#F3D9D6" opacity="0.8" />
          </g>
        </svg>

        {/* Botanical corner SVG — bottom-right (mirrored) */}
        <svg className={styles.botanicalBR} viewBox="0 0 80 80" aria-hidden>
          <g opacity="0.6" transform="scale(-1,1) translate(-80,0)">
            <path d="M5,75 Q20,50 40,40 Q25,60 10,70 Z" fill="#A9B89A" />
            <ellipse cx="38" cy="42" rx="4" ry="7" fill="#F3D9D6" transform="rotate(-30 38 42)" />
            <ellipse cx="28" cy="52" rx="3" ry="5" fill="#F5C9AA" transform="rotate(-45 28 52)" />
            <circle cx="15" cy="67" r="4" fill="#F3D9D6" opacity="0.8" />
          </g>
        </svg>

        {/* Greeting text */}
        <div className={styles.greeting}>
          <p className={styles.greetingLabel}>Kepada</p>
          <p className={styles.greetingName}>
            {isPersonalized ? name : 'Tamu Undangan Terkasih'}
          </p>
        </div>

        {/* Wax seal — centered lower third */}
        <WaxSeal state={state} />

        {/* Tap cue */}
        {state === 'IDLE' && (
          <p className={styles.tapCue} aria-live="polite">
            Ketuk untuk membuka
          </p>
        )}
      </div>
    </div>
  )
}
```

---

## 8. `WaxSeal.tsx` — Animated Seal

Uses `cat-wreath-seal.png` (sleeping cat in a floral wreath circle — perfect as a wax seal motif).

```typescript
// components/GateScreen/WaxSeal.tsx
import styles from './gate.module.css'
import Image from 'next/image'

type SealState = 'IDLE' | 'CRACKING' | 'OPENING' | 'BLOOMING' | 'DONE'

export default function WaxSeal({ state }: { state: SealState }) {
  return (
    <div className={`${styles.seal} ${state === 'CRACKING' ? styles.sealCracking : ''}`}
         aria-hidden>
      {/* Amber wax circle */}
      <div className={styles.sealCircle}>
        {/* Cat wreath illustration inside the seal */}
        <Image
          src="/assets/icons/cat-wreath-seal.png"
          alt=""
          width={80}
          height={80}
          className={styles.sealImage}
          priority
        />
        {/* Crack lines — appear on CRACKING state */}
        <svg className={styles.sealCracks} viewBox="0 0 100 100" aria-hidden>
          <line x1="50" y1="50" x2="30" y2="20" stroke="#8B5E1A" strokeWidth="1.5" opacity="0" className={styles.crack1}/>
          <line x1="50" y1="50" x2="75" y2="25" stroke="#8B5E1A" strokeWidth="1"   opacity="0" className={styles.crack2}/>
          <line x1="50" y1="50" x2="80" y2="60" stroke="#8B5E1A" strokeWidth="1.5" opacity="0" className={styles.crack3}/>
          <line x1="50" y1="50" x2="20" y2="70" stroke="#8B5E1A" strokeWidth="1"   opacity="0" className={styles.crack4}/>
        </svg>
      </div>
    </div>
  )
}
```

---

## 9. `gate.module.css` — All Animations

```css
/* gate.module.css */

/* ─── ROOT ─────────────────────────────────────────────── */
.gate-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-ivory);
  cursor: pointer;
  user-select: none;
}

/* ─── ENVELOPE CONTAINER ───────────────────────────────── */
.envelope {
  position: relative;
  width: min(340px, 90vw);
  height: min(480px, 85vh);
  filter: drop-shadow(0 24px 48px rgba(74, 64, 57, 0.18));
  transition: filter 0.3s ease;
}

/* Desktop: smaller card centered */
@media (min-width: 768px) {
  .envelope {
    width: 380px;
    height: 520px;
  }
}

/* ─── ENVELOPE BODY ────────────────────────────────────── */
.envelopeBody {
  position: absolute;
  inset: 0;
  background: #FBF7F0;  /* --color-ivory */
  border-radius: 4px;
  /* Paper grain noise texture */
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E"),
    linear-gradient(135deg, #FBF7F0 0%, #F3E9DC 100%);
  background-size: 200px 200px, 100% 100%;
  overflow: hidden;
}

/* ─── FLAP (triangular fold) ───────────────────────────── */
.envelopeFlap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 55%;
  clip-path: polygon(0% 0%, 100% 0%, 50% 58%);
  background: linear-gradient(160deg, #F3D9D6 0%, #EBC8C4 60%, #D9A7A0 100%);
  transform-origin: top center;
  transition: transform 0.8s var(--ease-enter), opacity 0.6s ease;
  z-index: 2;
}

/* Flap inner face — visible when open */
.envelopeFlap::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #FBF7F0 0%, #F3E9DC 60%);
  clip-path: polygon(0% 0%, 100% 0%, 50% 58%);
  opacity: 0;
  transition: opacity 0.4s ease 0.3s;
}

/* ─── OPENING STATE ────────────────────────────────────── */
.envelope--opening .envelopeFlap {
  transform: perspective(800px) rotateX(-165deg);
  opacity: 0.3;
}
.envelope--opening .envelopeFlap::after {
  opacity: 1;
}
.envelope--blooming .envelopeFlap {
  transform: perspective(800px) rotateX(-175deg);
  opacity: 0;
}

/* ─── BOTANICAL CORNERS ────────────────────────────────── */
.botanicalBL {
  position: absolute;
  bottom: 12px;
  left: 10px;
  width: 80px;
  height: 80px;
  pointer-events: none;
}
.botanicalBR {
  position: absolute;
  bottom: 12px;
  right: 10px;
  width: 80px;
  height: 80px;
  pointer-events: none;
}

/* ─── GREETING TEXT ────────────────────────────────────── */
.greeting {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  width: 80%;
}
.greetingLabel {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--color-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.greetingName {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  color: var(--color-ink);
  line-height: 1.3;
}

/* ─── WAX SEAL ─────────────────────────────────────────── */
.seal {
  position: absolute;
  bottom: 22%;
  left: 50%;
  transform: translateX(-50%);
  animation: sealPulse 3s ease-in-out infinite;
}

.sealCircle {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #E8A82A, #C8922A 60%, #9A6B1A);
  box-shadow:
    0 4px 16px rgba(200, 146, 42, 0.4),
    inset 0 -2px 8px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.sealImage {
  width: 80px;
  height: 80px;
  object-fit: contain;
  mix-blend-mode: multiply;
  opacity: 0.85;
}

/* Crack lines */
.sealCracks line { transition: opacity 0.1s ease; }
.sealCracking .crack1 { animation: crackAppear 0.08s ease 0s    forwards; }
.sealCracking .crack2 { animation: crackAppear 0.08s ease 0.04s forwards; }
.sealCracking .crack3 { animation: crackAppear 0.08s ease 0.08s forwards; }
.sealCracking .crack4 { animation: crackAppear 0.08s ease 0.12s forwards; }

.envelope--cracking .seal {
  animation: sealCrack 0.25s var(--ease-settle) forwards;
}
.envelope--opening .seal,
.envelope--blooming .seal {
  animation: sealExit 0.3s ease forwards;
}

/* ─── TAP CUE ──────────────────────────────────────────── */
.tapCue {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  color: var(--color-muted);
  text-transform: uppercase;
  animation: tapCuePulse 2.5s ease-in-out infinite;
  white-space: nowrap;
}

/* ─── LIGHT BLOOM ──────────────────────────────────────── */
.light-bloom {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 70% 60% at 50% 40%,
    rgba(245, 201, 170, 0.9) 0%,
    rgba(251, 247, 240, 0.7) 40%,
    rgba(251, 247, 240, 0) 70%
  );
  animation: lightBloom 0.6s var(--ease-enter) both;
  z-index: 10000;
}

/* ─── KEYFRAMES ────────────────────────────────────────── */
@keyframes sealPulse {
  0%, 100% { transform: translateX(-50%) scale(1); }
  50%       { transform: translateX(-50%) scale(1.04); }
}

@keyframes sealCrack {
  0%   { transform: translateX(-50%) scale(1)    rotate(0deg); }
  30%  { transform: translateX(-50%) scale(1.08) rotate(2deg); }
  60%  { transform: translateX(-50%) scale(0.95) rotate(-1deg); }
  100% { transform: translateX(-50%) scale(1.02) rotate(0deg); }
}

@keyframes sealExit {
  to {
    transform: translateX(-50%) scale(0.6) rotate(12deg);
    opacity: 0;
  }
}

@keyframes crackAppear {
  to { opacity: 1; }
}

@keyframes tapCuePulse {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) translateY(0); }
  50%       { opacity: 1;   transform: translateX(-50%) translateY(-3px); }
}

@keyframes lightBloom {
  from { opacity: 0; transform: scale(0.8); }
  to   { opacity: 1; transform: scale(1); }
}

/* ─── REDUCED MOTION OVERRIDES ─────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .seal,
  .tapCue,
  .light-bloom { animation: none !important; }
  .envelopeFlap { transition: opacity 0.3s ease !important; }
}
```

---

## 10. Transition Timing Reference

| Event | Offset from tap | Duration | Notes |
|---|---|---|---|
| Audio fade-in start | 0ms | 1200ms | 0 → 0.5 volume |
| Gyro permission dialog | 0ms | immediate | iOS blocks if delayed |
| Seal crack animation | 0ms | 250ms | `sealCrack` keyframe |
| Flap opens | 250ms | 800ms | `rotateX(-165deg)` |
| Light bloom | 250ms | 600ms | radial gradient fade |
| Gate unmounts | 1450ms | — | `onTransitionComplete()` called |
| Hero fade-in (in parent) | 1200ms | 400ms | crossfade overlap |

---

## 11. iOS Audio Unlock Notes

- `audio.play()` **must** be called inside the tap handler (synchronous call stack from user gesture)
- Volume starts at `0` — call `.play()` then ramp volume in RAF loop
- `HTMLAudioElement` is preferred over `AudioContext` here for simplicity
- The audio element reference is stored in a module-level singleton so `HeroSection` can grab it later

```typescript
// utils/audioSingleton.ts
let _audio: HTMLAudioElement | null = null
export const getAudio = () => _audio
export const setAudio = (a: HTMLAudioElement) => { _audio = a }
// useGateTransition sets it; AudioControl reads it
```

---

## 12. Desktop Adaptation

```css
/* Full-bleed on mobile, centered card on desktop */
@media (min-width: 768px) {
  .gate-root {
    background: linear-gradient(135deg, #F3E9DC 0%, #EBC8C4 50%, #F3E9DC 100%);
  }
  .envelope {
    box-shadow: 0 40px 80px rgba(74, 64, 57, 0.25);
  }
}
```

On desktop, the gate shows the same envelope but with a blush-gradient backdrop. The transition is identical — no layout changes needed, only the background differs.

---

## 13. Accessibility Checklist

- `role="button"` + `aria-label="Open your invitation"` on the tap target
- `aria-live="polite"` on the tap cue so screen readers announce it
- `prefers-reduced-motion` respected: all animations disabled, only opacity fades remain
- Guest name in `aria-live` container: screen reader announces personalized greeting
- Gate is not keyboard-trapped: press Enter/Space also triggers `handleTap`
  ```typescript
  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTap() }}
  tabIndex={0}
  ```

---

## 14. File Copy Instructions for Assets

```bash
# Run from project root after cloning assets
mkdir -p public/assets/icons

cp "Recovered/correct/most correct/png asset website 2/18.png" \
   public/assets/icons/cat-wreath-seal.png

cp "Recovered/correct/most correct/png asset website 2/19.png" \
   public/assets/icons/doves-bouquet.png
```

---

## 15. `globals.css` Design Tokens (define once, used everywhere)

```css
/* app/globals.css */
:root {
  --color-ivory:   #FBF7F0;
  --color-cream:   #F3E9DC;
  --color-blush:   #F3D9D6;
  --color-dusty:   #D9A7A0;
  --color-peach:   #F5C9AA;
  --color-sage:    #A9B89A;
  --color-drapery: #FFFFFF;
  --color-ink:     #4A4039;
  --color-muted:   #7A6E68;

  --ease-enter:  cubic-bezier(0.22, 1, 0.36, 1);
  --ease-soft:   cubic-bezier(0.45, 0, 0.55, 1);
  --ease-float:  cubic-bezier(0.45, 0, 0.55, 1);
  --ease-settle: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-exit:   cubic-bezier(0.55, 0, 1, 0.45);

  --dur-micro:    200ms;
  --dur-base:     500ms;
  --dur-enter:    850ms;
  --dur-assemble: 1600ms;
  --loop-slow:    6000ms;
  --loop-ambient: 12000ms;

  --font-serif: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  --font-sans:  'DM Sans', 'Inter', system-ui, sans-serif;
  --font-script: 'Great Vibes', 'Dancing Script', cursive;
}
```
