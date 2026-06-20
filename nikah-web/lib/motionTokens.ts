/**
 * Motion tokens — single source of truth for every animation in nikah-web.
 *
 * Values are lifted verbatim from `docs/08-motion-principles.md` §3 (Motion Tokens).
 * Both `motion` (Framer Motion v12 / motion package) and `gsap` read from here via
 * `motionAdapter.ts`. No magic numbers in component code.
 *
 * The contract:
 * - Easing tokens map to a cubic-bezier tuple AND a string form for GSAP `vars`.
 * - Duration tokens are in seconds (Motion) and seconds (GSAP); millisecond values
 *   are exposed separately only for documentation.
 * - Distance/amplitude tokens are in px (mobile baseline; section-level multipliers
 *   apply on desktop per `useParallax`).
 * - Spring tokens are Motion-native (stiffness/damping) — GSAP reads the equivalent
 *   `power3.out` / `back.out` easing when it needs the same feel.
 */

export const easing = {
  enter: [0.22, 1, 0.36, 1] as const,
  soft: "power2.inOut",
  float: "sine.inOut",
  settle: "back.out(1.3)",
  exit: "power2.in",
} as const;

export type EasingName = keyof typeof easing;

export const cubicBezier = (name: EasingName): [number, number, number, number] => {
  const e = easing[name];
  if (typeof e === "string") {
    // GSAP easing shorthand — caller should use `gsapEase()` for GSAP timelines.
    throw new Error(`easing.${name} is a GSAP shorthand; use gsapEase() instead.`);
  }
  return [e[0], e[1], e[2], e[3]];
};

/** Convert an easing name to a cubic-bezier string usable by Motion / CSS. */
export const cubicBezierString = (name: EasingName): string => {
  const [a, b, c, d] = cubicBezier(name);
  return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
};

/** GSAP accepts the shorthand directly; alias kept for symmetry. */
export const gsapEase = (name: EasingName): string => {
  const e = easing[name];
  if (typeof e === "string") return e;
  return `cubic-bezier(${e[0]}, ${e[1]}, ${e[2]}, ${e[3]})`;
};

/** Durations in seconds. Millisecond equivalents noted in JSDoc for docs. */
export const dur = {
  /** 150–250ms — hover, tap. */
  micro: 0.2,
  /** 400–600ms — fade/slide. */
  base: 0.5,
  /** 700–1000ms — reveal section. */
  enter: 0.85,
  /** 1200–1800ms — Hero assemble total. */
  assemble: 1.5,
  /** 4000–8000ms — GSAP idle fallback loop. */
  loopSlow: 6,
  /** 8000–16000ms — doves/petals. */
  loopAmb: 12,
} as const;

export type DurationName = keyof typeof dur;

/** Amplitudes & distances in px (mobile baseline). */
export const move = {
  /** 24–40px — reveal translateY. */
  reveal: 32,
  /** 2–6px — float translateY. */
  float: 4,
} as const;

export const rot = {
  /** ±0.5°–±1.5° — sway rotation. */
  sway: 1.2,
} as const;

export const scale = {
  /** 1.000 → 1.010–1.018 — GSAP idle fallback breathing only. */
  breathMin: 1.0,
  breathMax: 1.014,
} as const;

export const parallax = {
  /** Max parallax amplitude per depth tier (0..5). Tier 0 (sky) smallest, 5 (particles) largest. */
  factorByTier: {
    0: 8,
    1: 16,
    2: 24,
    3: 36,
    4: 48,
    5: 60,
  } as const,
  /** Gyro lerp smoothing — 0..1, smaller = smoother. */
  smoothing: 0.08,
  /** Tilt factor as fraction of scroll factor (per docs/09 §4). */
  tiltFactor: 0.6,
} as const;

export const stagger = {
  /** 60ms — tight. */
  tight: 0.06,
  /** 100ms — base. */
  base: 0.1,
  /** 160ms — loose. */
  loose: 0.16,
} as const;

/**
 * Motion-native spring presets. GSAP cannot consume these directly; the adapter
 * maps the closest `gsapEase` for timeline use.
 */
export const spring = {
  gentle: { type: "spring" as const, stiffness: 120, damping: 20, mass: 0.8 },
  snappy: { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.6 },
  wobbly: { type: "spring" as const, stiffness: 180, damping: 12, mass: 0.9 },
} as const;

export type SpringName = keyof typeof spring;

/**
 * Depth tier 0..5 — mirrors `docs/08` §4 (Depth Tiers). Used by Hero + parallax.
 */
export type DepthTier = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Smart-fallback tier detected once on mount; SSR-safe default = "MID".
 * See `lib/tier.ts` for the detector and `MotionProvider` for the React boundary.
 */
export type Tier = "HIGH" | "MID" | "LOW" | "REDUCED";