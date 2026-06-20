# IMPL-05 — Micro-interactions (ACT 4: THE SOUL)

> "The small things. The moments guests will tell people about."

---

## 0. Asset Map for This File

| File in `/public/assets/` | Source | Interaction |
|---|---|---|
| `cats/cat-shiro-peek.png` | `png asset website 2/8.png` | CatPeek — Shiro peeking from bottom. Already has the perfect composition: head + paws visible at bottom edge. |
| `icons/cat-wreath-seal.png` | `png asset website 2/18.png` | RSVP submit botanical spinner — the round floral wreath rotates, then morphs to checkmark feel |
| `doves/doves-perched.png` | `png asset website 2/19.png` | Wishes section decorative, static |

All other interactions are pure CSS + JS. No additional assets required.

---

## 1. Component / Hook Structure

```
src/
  components/
    interactions/
      useRipple.ts            ← generic tap ripple hook
      PillSelect.tsx          ← RSVP attendance pill with morph
      FloatLabelInput.tsx     ← animated float label form input
      SubmitButton.tsx        ← botanical spinner → checkmark
      CopyButton.tsx          ← copy + cat paw toast
      AccordionItem.tsx       ← grid-rows FAQ reveal
      WishCard.tsx            ← FLIP prepend animation
      StickyRSVP.tsx          ← sticky CTA with entrance/exit/breathing
      CatPeek.tsx             ← Shiro peeking from bottom edge
      ScrollHint.tsx          ← chevron scroll cue in hero
      MusicNote.tsx           ← floating music note easter egg
      Toast.tsx               ← reusable toast queue system
    RSVPSection/
      index.tsx               ← uses PillSelect, FloatLabelInput, SubmitButton
    WishesSection/
      index.tsx               ← uses WishCard
```

---

## 2. `useRipple.ts` — Generic Tap Ripple

```typescript
// components/interactions/useRipple.ts
import { useCallback, useRef } from 'react'

interface RippleOptions {
  color?: string    // default: rgba(243,217,214,0.6) — blush
  duration?: number // default: 500ms
}

export function useRipple({ color = 'rgba(243,217,214,0.6)', duration = 500 }: RippleOptions = {}) {
  const containerRef = useRef<HTMLElement>(null)

  const createRipple = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const el = containerRef.current
    if (!el) return

    const rect   = el.getBoundingClientRect()
    const isTouch = 'touches' in e
    const x = isTouch
      ? (e as React.TouchEvent).touches[0].clientX - rect.left
      : (e as React.MouseEvent).clientX - rect.left
    const y = isTouch
      ? (e as React.TouchEvent).touches[0].clientY - rect.top
      : (e as React.MouseEvent).clientY - rect.top

    const size     = Math.max(rect.width, rect.height) * 2
    const ripple   = document.createElement('span')
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top:  ${y - size / 2}px;
      background: ${color};
      transform: scale(0);
      animation: rippleExpand ${duration}ms ease-out forwards;
      pointer-events: none;
    `
    el.style.position = 'relative'
    el.style.overflow = 'hidden'
    el.appendChild(ripple)
    setTimeout(() => ripple.remove(), duration)
  }, [color, duration])

  return { containerRef, createRipple }
}

/* Add to globals.css:
@keyframes rippleExpand {
  to { transform: scale(1); opacity: 0; }
}
*/
```

---

## 3. `PillSelect.tsx` — RSVP Attendance Pill

```typescript
// components/interactions/PillSelect.tsx
'use client'
import { useState, useRef } from 'react'
import gsap from 'gsap'
import styles from './interactions.module.css'

interface Option { value: string; label: string }

interface Props {
  options: Option[]
  value: string
  onChange: (v: string) => void
}

export default function PillSelect({ options, value, onChange }: Props) {
  return (
    <div className={styles.pillGroup} role="radiogroup" aria-label="Kehadiran">
      {options.map(opt => (
        <Pill
          key={opt.value}
          option={opt}
          selected={value === opt.value}
          onSelect={() => onChange(opt.value)}
        />
      ))}
    </div>
  )
}

function Pill({ option, selected, onSelect }: { option: Option; selected: boolean; onSelect: () => void }) {
  const pillRef      = useRef<HTMLButtonElement>(null)
  const fillRef      = useRef<HTMLSpanElement>(null)
  const checkRef     = useRef<SVGPathElement>(null)

  const handleClick = () => {
    if (selected) return
    onSelect()

    const btn  = pillRef.current
    const fill = fillRef.current
    const check = checkRef.current
    if (!btn || !fill || !check) return

    // 1. Scale pulse
    gsap.fromTo(btn, { scale: 1 }, { scale: 1.04, yoyo: true, repeat: 1, duration: 0.15, ease: 'power1.out' })

    // 2. Background flood via clip-path circle expand
    gsap.fromTo(fill,
      { clipPath: 'circle(0% at 50% 50%)' },
      { clipPath: 'circle(120% at 50% 50%)', duration: 0.4, ease: 'power2.out' })

    // 3. Checkmark SVG stroke draw
    const length = check.getTotalLength?.() ?? 30
    gsap.fromTo(check,
      { strokeDashoffset: length },
      { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out', delay: 0.15 })
  }

  return (
    <button
      ref={pillRef}
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={handleClick}
      className={`${styles.pill} ${selected ? styles.pillSelected : ''}`}
    >
      {/* Flood fill layer */}
      <span ref={fillRef} className={styles.pillFill} aria-hidden />

      {/* Checkmark SVG */}
      <svg className={styles.pillCheck} width={16} height={16} viewBox="0 0 16 16" aria-hidden>
        <path
          ref={checkRef}
          d="M3 8 L6.5 11.5 L13 5"
          stroke="white"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={30}
          strokeDashoffset={selected ? 0 : 30}
          style={{ transition: selected ? 'none' : undefined }}
        />
      </svg>

      <span className={styles.pillLabel}>{option.label}</span>
    </button>
  )
}
```

```css
/* interactions.module.css — pill section */
.pillGroup {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.pill {
  position: relative;
  overflow: hidden;
  padding: 10px 20px;
  border-radius: 100px;
  border: 1.5px solid var(--color-blush);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  color: var(--color-ink);
  transition: border-color 0.2s ease;
}
.pillSelected {
  border-color: var(--color-dusty);
  color: white;
}
.pillFill {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-dusty), var(--color-blush));
  clip-path: circle(0% at 50% 50%);
  pointer-events: none;
  z-index: 0;
}
.pillCheck { position: relative; z-index: 1; flex-shrink: 0; }
.pillLabel { position: relative; z-index: 1; }
```

---

## 4. `FloatLabelInput.tsx` — Focus-Animated Form Input

```typescript
// components/interactions/FloatLabelInput.tsx
import { useState, useId } from 'react'
import styles from './interactions.module.css'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  error?: string
  multiline?: boolean
}

export default function FloatLabelInput({
  label, value, onChange, type = 'text', required, error, multiline
}: Props) {
  const id       = useId()
  const [focused, setFocused] = useState(false)
  const floating = focused || value.length > 0

  const sharedProps = {
    id,
    value,
    onChange: (e: React.ChangeEvent<any>) => onChange(e.target.value),
    onFocus:  () => setFocused(true),
    onBlur:   () => setFocused(false),
    required,
    className: `${styles.input} ${error ? styles.inputError : ''} ${multiline ? styles.textarea : ''}`,
  }

  return (
    <div className={styles.fieldWrapper}>
      {multiline
        ? <textarea rows={4} {...sharedProps} />
        : <input type={type} {...sharedProps} />
      }

      <label
        htmlFor={id}
        className={`${styles.floatLabel} ${floating ? styles.floatLabelUp : ''} ${error ? styles.floatLabelError : ''}`}
      >
        {label}
      </label>

      {/* Underline — grows from center on focus */}
      <span className={`${styles.underline} ${focused ? styles.underlineActive : ''}`} aria-hidden />

      {error && (
        <p className={styles.errorMsg} role="alert">{error}</p>
      )}
    </div>
  )
}
```

```css
/* interactions.module.css — input section */
.fieldWrapper {
  position: relative;
  margin-bottom: 28px;
}
.input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1.5px solid var(--color-blush);
  padding: 12px 0 6px;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-ink);
  outline: none;
  resize: none;   /* for textarea */
}
.textarea { min-height: 80px; }
.inputError { border-bottom-color: var(--color-dusty); }

.floatLabel {
  position: absolute;
  left: 0;
  top: 12px;
  font-family: var(--font-sans);
  font-size: 1rem;
  color: var(--color-muted);
  pointer-events: none;
  transition:
    top           var(--dur-micro) var(--ease-enter),
    font-size     var(--dur-micro) var(--ease-enter),
    color         var(--dur-micro) var(--ease-enter);
}
.floatLabelUp {
  top: -8px;
  font-size: 0.72rem;
  color: var(--color-dusty);
  letter-spacing: 0.05em;
}
.floatLabelError { color: #C0392B; }

/* Underline grows from center */
.underline {
  display: block;
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0%;
  height: 2px;
  background: var(--color-dusty);
  transform: translateX(-50%);
  transition: width var(--dur-micro) var(--ease-enter);
  pointer-events: none;
}
.underlineActive {
  width: 100%;
}

.errorMsg {
  font-size: 0.75rem;
  color: #C0392B;
  margin-top: 4px;
  animation: errorShake 0.3s ease;
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0);   }
  20%       { transform: translateX(3px); }
  40%       { transform: translateX(-3px); }
  60%       { transform: translateX(3px); }
  80%       { transform: translateX(-3px); }
}
```

---

## 5. `SubmitButton.tsx` — Botanical Spinner → Checkmark

The spinner uses the circular floral wreath (`cat-wreath-seal.png`) which rotates during submission, then the wreath image fades and a checkmark SVG draws in.

```typescript
// components/interactions/SubmitButton.tsx
'use client'
import { useState, useRef } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import styles from './interactions.module.css'

type ButtonState = 'idle' | 'loading' | 'success' | 'error'

interface Props {
  onSubmit: () => Promise<void>
  label?: string
}

export default function SubmitButton({ onSubmit, label = 'Kirim Konfirmasi' }: Props) {
  const [state, setState] = useState<ButtonState>('idle')
  const btnRef     = useRef<HTMLButtonElement>(null)
  const spinnerRef = useRef<HTMLDivElement>(null)
  const checkRef   = useRef<SVGPathElement>(null)
  const petalRefs  = useRef<HTMLSpanElement[]>([])

  const handleClick = async () => {
    if (state !== 'idle') return
    setState('loading')

    // Start spinner rotation
    const spinnerLoop = gsap.to(spinnerRef.current, {
      rotation: 360, duration: 1.2,
      repeat: -1, ease: 'linear',
    })

    try {
      await onSubmit()
      spinnerLoop.kill()
      setState('success')

      // Wreath fade out
      gsap.to(spinnerRef.current, { opacity: 0, scale: 0.8, duration: 0.3 })

      // Checkmark draw
      const checkEl = checkRef.current
      if (checkEl) {
        const len = 40
        gsap.fromTo(checkEl,
          { strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', delay: 0.2 })
      }

      // Petal burst from center
      burstPetals(btnRef.current!)

      // Reset after 3s
      setTimeout(() => setState('idle'), 3000)

    } catch {
      spinnerLoop.kill()
      setState('error')
      gsap.to(spinnerRef.current, { opacity: 0, duration: 0.2 })
      gsap.to(btnRef.current, {
        x: 4, yoyo: true, repeat: 5, duration: 0.07, ease: 'none',
        onComplete: () => gsap.set(btnRef.current, { x: 0 })
      })
      setTimeout(() => setState('idle'), 2000)
    }
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex', justifyContent: 'center' }}>
      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        disabled={state !== 'idle'}
        className={`${styles.submitBtn} ${styles[`submitBtn--${state}`]}`}
      >
        {/* Default label */}
        {state === 'idle' && label}

        {/* Loading: wreath spinner */}
        {state === 'loading' && (
          <div ref={spinnerRef} className={styles.spinner}>
            <Image
              src="/assets/icons/cat-wreath-seal.png"
              alt=""
              width={32}
              height={32}
              style={{ opacity: 0.8 }}
            />
          </div>
        )}

        {/* Success: checkmark SVG */}
        {state === 'success' && (
          <svg width={28} height={28} viewBox="0 0 28 28" aria-label="Berhasil!">
            <path
              ref={checkRef}
              d="M5 14 L11 20 L23 8"
              stroke="white"
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={40}
              strokeDashoffset={40}
            />
          </svg>
        )}

        {state === 'error' && 'Gagal — Coba Lagi'}
      </button>
    </div>
  )
}

// Petal burst: 8 colored divs scatter from center
function burstPetals(parent: HTMLElement) {
  const colors = ['#F3D9D6', '#F5C9AA', '#D9A7A0', '#FBF7F0', '#F3E9DC', '#EBC8C4', '#A9B89A', '#F3D9D6']
  colors.forEach((color, i) => {
    const petal = document.createElement('span')
    const angle = (i / colors.length) * 360
    const dist  = 40 + Math.random() * 30
    petal.style.cssText = `
      position: absolute;
      width: 8px;
      height: 12px;
      border-radius: 50%;
      background: ${color};
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 20;
    `
    parent.appendChild(petal)
    const rad    = (angle * Math.PI) / 180
    const tx     = Math.cos(rad) * dist
    const ty     = Math.sin(rad) * dist

    gsap.to(petal, {
      x: tx, y: ty,
      opacity: 0,
      scale: 0.3,
      duration: 0.7,
      ease: 'power2.out',
      onComplete: () => petal.remove(),
    })
  })
}
```

```css
/* interactions.module.css — submit button */
.submitBtn {
  padding: 14px 40px;
  border-radius: 100px;
  border: none;
  background: linear-gradient(135deg, var(--color-dusty), var(--color-blush));
  color: white;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  min-width: 180px;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s ease, transform 0.15s var(--ease-settle);
}
.submitBtn:hover:not(:disabled) {
  background: linear-gradient(135deg, #C08080, var(--color-dusty));
  transform: scale(1.02);
}
.submitBtn:disabled { opacity: 0.7; cursor: not-allowed; }
.submitBtn--success { background: linear-gradient(135deg, var(--color-sage), #8DB08A); }
.submitBtn--error   { background: linear-gradient(135deg, #C0392B, #E74C3C); }

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
}
```

---

## 6. `CopyButton.tsx` — Copy + Cat Paw Toast

```typescript
// components/interactions/CopyButton.tsx
'use client'
import { useRef } from 'react'
import gsap from 'gsap'
import { showToast } from './Toast'
import styles from './interactions.module.css'

interface Props { text: string; label?: string }

export default function CopyButton({ text, label = 'Salin' }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }

    // Button scale down → up
    gsap.fromTo(btnRef.current,
      { scale: 0.96 },
      { scale: 1, duration: 0.3, ease: 'back.out(2)' })

    // Show cat paw toast
    showToast('Tersalin ✓', { icon: 'paw' })
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleCopy}
      className={styles.copyBtn}
    >
      {/* Paw print SVG inline */}
      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <ellipse cx="7"  cy="3"  rx="2.5" ry="2"   />
        <ellipse cx="12" cy="2"  rx="2"   ry="1.5" />
        <ellipse cx="17" cy="3"  rx="2.5" ry="2"   />
        <ellipse cx="4"  cy="8"  rx="2"   ry="2.5" />
        <ellipse cx="20" cy="8"  rx="2"   ry="2.5" />
        <path d="M12 22c-3.3 0-7-2.5-7-6.5 0-2.2 1.5-3.5 3-4.5h8c1.5 1 3 2.3 3 4.5 0 4-3.7 6.5-7 6.5z"/>
      </svg>
      {label}
    </button>
  )
}
```

```css
.copyBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 100px;
  border: 1.5px solid var(--color-blush);
  background: transparent;
  color: var(--color-dusty);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.copyBtn:hover {
  background: var(--color-blush);
  border-color: var(--color-dusty);
  color: var(--color-ink);
}
```

---

## 7. `Toast.tsx` — Reusable Toast Queue (max 3)

```typescript
// components/interactions/Toast.tsx
'use client'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import styles from './interactions.module.css'

interface ToastItem { id: number; message: string; icon?: 'paw' | 'check' }

// Singleton store — avoid provider pattern for simplicity
let _addToast: ((msg: string, opts?: { icon?: ToastItem['icon'] }) => void) | null = null

export function showToast(message: string, opts?: { icon?: ToastItem['icon'] }) {
  _addToast?.(message, opts)
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  let nextId = 0

  useEffect(() => {
    _addToast = (message, opts) => {
      const id = ++nextId
      setToasts(prev => {
        const next = [...prev, { id, message, icon: opts?.icon }]
        return next.slice(-3)  // max 3 visible
      })
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 2000)
    }
    return () => { _addToast = null }
  }, [])

  return (
    <div className={styles.toastContainer} aria-live="polite" role="status">
      {toasts.map(toast => (
        <div key={toast.id} className={styles.toast}>
          {toast.icon === 'paw' && (
            <svg width={14} height={14} viewBox="0 0 24 24" fill="var(--color-dusty)" aria-hidden>
              <ellipse cx="7"  cy="3"  rx="2.5" ry="2" />
              <ellipse cx="12" cy="2"  rx="2"   ry="1.5" />
              <ellipse cx="17" cy="3"  rx="2.5" ry="2" />
              <ellipse cx="4"  cy="8"  rx="2"   ry="2.5" />
              <ellipse cx="20" cy="8"  rx="2"   ry="2.5" />
              <path d="M12 22c-3.3 0-7-2.5-7-6.5 0-2.2 1.5-3.5 3-4.5h8c1.5 1 3 2.3 3 4.5 0 4-3.7 6.5-7 6.5z"/>
            </svg>
          )}
          {toast.message}
        </div>
      ))}
    </div>
  )
}
```

```css
/* interactions.module.css — toast section */
.toastContainer {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  align-items: center;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(251, 247, 240, 0.95);
  border: 1px solid var(--color-blush);
  border-radius: 100px;
  box-shadow: 0 4px 16px rgba(74, 64, 57, 0.12);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: var(--color-ink);
  backdrop-filter: blur(8px);
  animation: toastIn 0.3s var(--ease-settle) both;
}

@keyframes toastIn {
  from { opacity: 0; transform: translateY(12px) scale(0.9); }
  to   { opacity: 1; transform: translateY(0)    scale(1);   }
}
```

Mount `<ToastContainer />` once in `app/layout.tsx`.

---

## 8. `AccordionItem.tsx` — Grid-Rows FAQ Reveal

```typescript
// components/interactions/AccordionItem.tsx
'use client'
import { useState } from 'react'
import styles from './interactions.module.css'

interface Props { question: string; answer: string }

export default function AccordionItem({ question, answer }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={styles.accordionTrigger}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width={18} height={18} viewBox="0 0 18 18" aria-hidden
        >
          <path d="M4 6 L9 11 L14 6" stroke="currentColor" strokeWidth={1.8} fill="none" strokeLinecap="round" />
        </svg>
      </button>

      <div
        className={styles.accordionPanel}
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className={styles.accordionInner}>
          <p className={styles.accordionBody}>{answer}</p>
        </div>
      </div>
    </div>
  )
}
```

```css
/* interactions.module.css — accordion section */
.accordion {
  border-bottom: 1px solid var(--color-blush);
  overflow: hidden;
}
.accordionTrigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--color-ink);
  text-align: left;
  gap: 12px;
}
.chevron {
  flex-shrink: 0;
  color: var(--color-dusty);
  transition: transform var(--dur-base) var(--ease-soft);
}
.chevronOpen {
  transform: rotate(180deg);
}
/* The grid trick — no max-height, no JS height calculation */
.accordionPanel {
  display: grid;
  /* grid-template-rows is set inline: 0fr or 1fr */
  transition: grid-template-rows var(--dur-base) var(--ease-enter);
}
.accordionInner {
  overflow: hidden;
}
.accordionBody {
  padding: 0 0 16px;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-muted);
  animation: fadeIn var(--dur-base) var(--ease-enter);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

---

## 9. `WishCard.tsx` — New Wish FLIP Prepend Animation

```typescript
// components/interactions/WishCard.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import styles from './interactions.module.css'

gsap.registerPlugin(Flip)

interface Wish { id: string; name: string; message: string; timestamp: Date }

interface Props {
  wish: Wish
  isNew?: boolean
}

export default function WishCard({ wish, isNew = false }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isNew || !cardRef.current) return
    const el = cardRef.current

    // Capture state before DOM changes (called from WishesSection before prepend)
    // This component enters pre-rendered; animate it in:
    gsap.fromTo(el,
      { y: -40, opacity: 0, backgroundColor: 'rgba(243, 217, 214, 0.4)' },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'back.out(1.4)',
        onComplete: () => {
          // Fade highlight back to normal ivory
          gsap.to(el, {
            backgroundColor: 'transparent',
            duration: 1, ease: 'power1.out'
          })
        }
      }
    )
  }, [isNew])

  return (
    <div ref={cardRef} className={styles.wishCard}>
      <div className={styles.wishHeader}>
        <span className={styles.wishName}>{wish.name}</span>
        <span className={styles.wishTime}>
          {wish.timestamp.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
        </span>
      </div>
      <p className={styles.wishMessage}>{wish.message}</p>
    </div>
  )
}
```

```css
/* interactions.module.css — wish card */
.wishCard {
  padding: 16px;
  border: 1px solid var(--color-blush);
  border-radius: 8px;
  background: transparent;
  font-family: var(--font-sans);
}
.wishHeader {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}
.wishName {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-ink);
}
.wishTime {
  font-size: 0.72rem;
  color: var(--color-muted);
}
.wishMessage {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--color-muted);
  white-space: pre-wrap;
}
```

**WishesSection — FLIP setup** (brief):
```typescript
// When a new wish is submitted:
const container  = wishesContainerRef.current
const state      = Flip.getState(container.children)  // capture before DOM change
const newCard    = { ...newWish, isNew: true }
setWishes(prev => [newCard, ...prev])                   // prepend in React state
Flip.from(state, { duration: 0.4, ease: 'power2.out' }) // animate others shifting down
```

---

## 10. `StickyRSVP.tsx` — Sticky CTA Button

```typescript
// components/interactions/StickyRSVP.tsx
'use client'
import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useRipple } from './useRipple'
import styles from './interactions.module.css'

export default function StickyRSVP() {
  const [visible, setVisible] = useState(false)
  const btnRef  = useRef<HTMLDivElement>(null)
  const breathRef = useRef<gsap.core.Tween | null>(null)
  const { containerRef, createRipple } = useRipple({ color: 'rgba(255,255,255,0.3)' })

  useEffect(() => {
    const heroEl = document.getElementById('hero')
    const rsvpEl = document.getElementById('rsvp')
    if (!heroEl || !rsvpEl) return

    // Show after hero exits
    const heroObs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) {
        setVisible(true)
        heroObs.disconnect()
      }
    }, { threshold: 0.1 })
    heroObs.observe(heroEl)

    // Hide when RSVP section is visible
    const rsvpObs = new IntersectionObserver(([e]) => {
      setVisible(!e.isIntersecting)
    }, { threshold: 0.2 })
    rsvpObs.observe(rsvpEl)

    return () => { heroObs.disconnect(); rsvpObs.disconnect() }
  }, [])

  useEffect(() => {
    const el = btnRef.current
    if (!el) return
    if (visible) {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.8, y: 20 },
        { opacity: 1, scale: 1,   y: 0, duration: 0.4, ease: 'back.out(1.5)' })
      breathRef.current = gsap.to(el, {
        scale: 1.02, duration: 4,
        yoyo: true, repeat: -1, ease: 'sine.inOut'
      })
    } else {
      breathRef.current?.kill()
      gsap.to(el, { opacity: 0, scale: 0.8, duration: 0.25, ease: 'power2.in' })
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      ref={(el) => {
        (btnRef as any).current = el
        ;(containerRef as any).current = el
      }}
      className={styles.stickyRSVP}
      onClick={(e) => {
        createRipple(e)
        document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })
      }}
      role="button"
      tabIndex={0}
      aria-label="Konfirmasi kehadiran"
    >
      Konfirmasi Kehadiran
    </div>
  )
}
```

```css
.stickyRSVP {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 80;
  padding: 14px 32px;
  border-radius: 100px;
  background: linear-gradient(135deg, var(--color-dusty), var(--color-blush));
  color: white;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(217, 167, 160, 0.4);
  user-select: none;
  white-space: nowrap;
}
```

---

## 11. `CatPeek.tsx` — Shiro Peeking from Bottom

Uses `cat-shiro-peek.png` — perfectly composed for this: Shiro's face + paws visible at the bottom of the image, peering upward. Position at bottom edge of `ClosingSection`.

```typescript
// components/interactions/CatPeek.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import styles from './interactions.module.css'

export default function CatPeek() {
  const peekRef = useRef<HTMLDivElement>(null)
  const loopRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const el = peekRef.current
    if (!el) return

    const closingEl = document.getElementById('closing')
    if (!closingEl) return

    let entered = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !entered) {
          entered = true
          // Entrance: slide up from below
          gsap.fromTo(el,
            { y: 80, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.8,
              ease: 'back.out(1.8)',
              onComplete: startPeekLoop,
            }
          )
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(closingEl)
    return () => observer.disconnect()
  }, [])

  function startPeekLoop() {
    const el = peekRef.current
    if (!el) return

    const peek = () => {
      const wait = 6000 + Math.random() * 4000
      setTimeout(() => {
        // Peek down then back up
        gsap.to(el, {
          y: 64, duration: 0.6, ease: 'power2.in',
          onComplete: () => {
            gsap.to(el, { y: 0, duration: 0.8, ease: 'back.out(1.6)', onComplete: peek })
          }
        })
      }, wait)
    }
    peek()
  }

  return (
    <div
      ref={peekRef}
      className={styles.catPeek}
      aria-hidden
    >
      <Image
        src="/assets/cats/cat-shiro-peek.png"
        alt=""
        width={120}
        height={100}
        style={{ display: 'block' }}
      />
    </div>
  )
}
```

```css
.catPeek {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;
  z-index: 5;
}
```

---

## 12. `ScrollHint.tsx` — Hero Chevron Cue

```typescript
// components/interactions/ScrollHint.tsx
'use client'
import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

export default function ScrollHint() {
  const hintRef  = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    // Show after 3s if no scroll
    const timer = setTimeout(() => setShown(true), 3000)
    const onScroll = () => {
      clearTimeout(timer)
      setShown(false)
    }
    window.addEventListener('scroll', onScroll, { once: true })
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    const el = hintRef.current
    if (!el) return
    if (shown) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5 })
    } else {
      gsap.to(el, { opacity: 0, duration: 0.3 })
    }
  }, [shown])

  return (
    <div
      ref={hintRef}
      aria-hidden
      style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 8,
      }}
    >
      <svg
        width={28} height={28}
        viewBox="0 0 28 28"
        style={{ animation: 'scrollHintBob 1.5s ease-in-out infinite' }}
      >
        <path
          d="M6 10 L14 18 L22 10"
          stroke="rgba(74,64,57,0.5)"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

/* globals.css:
@keyframes scrollHintBob {
  0%, 100% { transform: translateY(0);  }
  50%       { transform: translateY(5px); }
}
*/
```

---

## 13. `MusicNote.tsx` — La Vie en Rose Easter Egg

Triggered once per session at Japan chapter entrance (see IMPL-04 §14). A music note floats up from the audio button position.

```typescript
// components/interactions/MusicNote.tsx
'use client'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function MusicNote() {
  const noteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const trigger = () => {
      const el = noteRef.current
      if (!el) return
      gsap.fromTo(el,
        { opacity: 1, y: 0, x: 0, scale: 1 },
        {
          opacity: 0,
          y:       -60,
          x:       (Math.random() - 0.5) * 20,
          scale:   1.3,
          duration: 1.5,
          ease:    'power1.out',
        }
      )
    }
    window.addEventListener('music-note-trigger', trigger)
    return () => window.removeEventListener('music-note-trigger', trigger)
  }, [])

  return (
    <div
      ref={noteRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 52,        // below audio button
        right: 22,
        zIndex: 99,
        opacity: 0,
        pointerEvents: 'none',
        color: 'var(--color-dusty)',
        fontSize: '20px',
        lineHeight: 1,
      }}
    >
      ♪
    </div>
  )
}
```

Mount once in layout: `<MusicNote />` alongside `<ToastContainer />`.

---

## 14. `RSVPSection/index.tsx` — Complete Form Assembly

```typescript
// components/RSVPSection/index.tsx
'use client'
import { useState } from 'react'
import SectionWrapper from '../sections/shared/SectionWrapper'
import PillSelect      from '../interactions/PillSelect'
import FloatLabelInput from '../interactions/FloatLabelInput'
import SubmitButton    from '../interactions/SubmitButton'
import Image           from 'next/image'
import styles from './rsvp.module.css'

interface FormState {
  name: string
  attendance: 'hadir' | 'tidak_hadir' | ''
  guests: string
  message: string
}
interface Errors { name?: string; attendance?: string }

export default function RSVPSection() {
  const [form, setForm] = useState<FormState>({ name: '', attendance: '', guests: '1', message: '' })
  const [errors, setErrors] = useState<Errors>({})

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.name.trim()) e.name = 'Nama tidak boleh kosong'
    if (!form.attendance)  e.attendance = 'Pilih kehadiran kamu'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) throw new Error('validation')

    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) throw new Error('server error')
  }

  return (
    <SectionWrapper id="rsvp" className={styles.rsvpSection}>
      {/* Laptop+phone illustration */}
      <div data-animate="illustration" data-side="right" style={{ textAlign: 'center', marginBottom: 32 }}>
        <Image
          src="/assets/icons/laptop-phone.png"
          alt="" aria-hidden
          width={200} height={120}
          style={{ width: '160px', height: 'auto' }}
        />
      </div>

      <h2 className={styles.rsvpTitle} data-animate="heading">
        Konfirmasi Kehadiran
      </h2>
      <p className={styles.rsvpSubtitle} data-animate="body">
        Agar kami bisa mempersiapkan yang terbaik untukmu.
      </p>

      <form className={styles.rsvpForm} onSubmit={e => e.preventDefault()} data-animate="body">
        <FloatLabelInput
          label="Nama Lengkap"
          value={form.name}
          onChange={v => setForm(f => ({ ...f, name: v }))}
          required
          error={errors.name}
        />

        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 12 }}>
            Kehadiran
          </p>
          <PillSelect
            options={[
              { value: 'hadir',      label: 'Insya Allah Hadir' },
              { value: 'tidak_hadir', label: 'Belum Bisa Hadir' },
            ]}
            value={form.attendance}
            onChange={v => setForm(f => ({ ...f, attendance: v as any }))}
          />
          {errors.attendance && (
            <p style={{ fontSize: '0.75rem', color: '#C0392B', marginTop: 8 }}>{errors.attendance}</p>
          )}
        </div>

        {form.attendance === 'hadir' && (
          <FloatLabelInput
            label="Jumlah Tamu (termasuk kamu)"
            value={form.guests}
            onChange={v => setForm(f => ({ ...f, guests: v }))}
            type="number"
          />
        )}

        <FloatLabelInput
          label="Pesan & Doa (opsional)"
          value={form.message}
          onChange={v => setForm(f => ({ ...f, message: v }))}
          multiline
        />

        <SubmitButton onSubmit={handleSubmit} label="Kirim Konfirmasi" />
      </form>
    </SectionWrapper>
  )
}
```

**API Route (`/api/rsvp/route.ts`) writes to Google Sheets:**
```typescript
// app/api/rsvp/route.ts
import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT!),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const sheets = google.sheets({ version: 'v4', auth })
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID!,
    range: 'RSVP!A:E',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toISOString(),
        body.name,
        body.attendance,
        body.guests,
        body.message,
      ]]
    }
  })
  return NextResponse.json({ ok: true })
}
```

---

## 15. Gate Open Button — Ripple + Scale Pulse

Already handled in `GateScreen/index.tsx` (IMPL-01). The `handleTap` function runs on the full gate screen. To add ripple:

```typescript
// In GateScreen/index.tsx, add useRipple:
const { containerRef, createRipple } = useRipple({ color: 'rgba(243,217,214,0.4)', duration: 600 })

// Bind to the gate-root div:
<div
  ref={containerRef}
  className="gate-root"
  data-state={state}
  onClick={(e) => { createRipple(e); handleTap() }}
  ...
>
```

---

## 16. Complete `interactions.module.css` Summary

All CSS for this file in one place. The individual class blocks are shown above, but here is the import chain:

```
globals.css          ← design tokens, breathing, rippleExpand, scrollHintBob
interactions.module.css ← all component-level classes (pill, input, toast, accordion, wish, sticky, catpeek)
```

No other CSS files needed for this impl file.

---

## 17. Accessibility Notes

| Component | Implementation |
|---|---|
| `PillSelect` | `role="radiogroup"`, each pill `role="radio"` + `aria-checked` |
| `FloatLabelInput` | `<label for>` tied to `useId()` — proper label association |
| `AccordionItem` | `aria-expanded` on trigger button |
| `SubmitButton` | `disabled` attr during loading/success/error |
| `ToastContainer` | `aria-live="polite"` + `role="status"` |
| `StickyRSVP` | `role="button"` + `tabIndex={0}` + keyboard handler |
| `CatPeek` | `aria-hidden="true"` — purely decorative |
| `ScrollHint` | `aria-hidden="true"` — decorative |
| `MusicNote` | `aria-hidden="true"` — easter egg |
| `CopyButton` | descriptive `aria-label` if icon-only |
