/**
 * Bridges `motionTokens.ts` into the runtime APIs of Motion + GSAP.
 * Both libraries consume the same numeric vocabulary — no magic numbers downstream.
 */
import {
  cubicBezier,
  cubicBezierString,
  dur,
  easing,
  gsapEase,
  move,
  parallax,
  rot,
  scale,
  spring,
  stagger,
  type DepthTier,
  type DurationName,
  type EasingName,
  type SpringName,
  type Tier,
} from "./motionTokens";
import type { Easing, Transition, Variants } from "motion/react";

/**
 * Motion's `Easing` accepts a bezier tuple — string `cubic-bezier(...)` forms
 * are CSS/GSAP-only and throw in motion/react v12. Always hand Motion the
 * numeric tuple.
 */
export const motionEase = (name: EasingName = "enter"): Easing =>
  cubicBezier(name) as unknown as Easing;

/** Motion transition object from a token name. `duration` is in seconds. */
export const motionTransition = (
  durationName: DurationName,
  easingName: EasingName = "enter",
): Transition => ({
  duration: dur[durationName],
  ease: motionEase(easingName),
});

/** Spring preset by name. */
export const motionSpring = (name: SpringName): Transition => spring[name];

/** Variants preset for staggered reveals (used with `MotionReveal`). */
export const revealVariants = (opts?: {
  y?: number;
  delay?: number;
  staggerChildren?: number;
  delayChildren?: number;
}): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: dur.enter,
      ease: motionEase("enter"),
      delayChildren: opts?.delayChildren ?? 0.05,
      staggerChildren: opts?.staggerChildren ?? stagger.base,
      delay: opts?.delay ?? 0,
    },
  },
});

export const revealChildVariants = (opts?: { y?: number; duration?: number }): Variants => ({
  hidden: { opacity: 0, y: opts?.y ?? 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: opts?.duration ?? dur.base,
      ease: motionEase("enter"),
    },
  },
});

/** GSAP vars builder — returns the object a `gsap.to(target, vars)` call expects. */
export const gsapVars = (
  durationName: DurationName,
  easingName: EasingName = "enter",
): gsap.TweenVars => ({
  duration: dur[durationName],
  ease: gsapEase(easingName),
});

/** Parallax max translate distance (px) for a given depth tier. */
export const parallaxForTier = (tier: DepthTier): number => parallax.factorByTier[tier];

/**
 * Tier-gated motion budget. `MotionReveal` and `MotionFloat` consult this so
 * REDUCED users get instant transitions, LOW users get minimal motion, etc.
 */
export const tierBudget = (tier: Tier) => {
  switch (tier) {
    case "HIGH":
      return { petals: 14, doves: 6, butterflies: 4, gyro: true, tilt: true };
    case "MID":
      return { petals: 6, doves: 3, butterflies: 2, gyro: true, tilt: false };
    case "LOW":
      return { petals: 0, doves: 0, butterflies: 0, gyro: false, tilt: false };
    case "REDUCED":
      return { petals: 0, doves: 0, butterflies: 0, gyro: false, tilt: false };
    default: {
      const _exhaustive: never = tier;
      return _exhaustive;
    }
  }
};

/**
 * Float-loop amplitude range (used by `MotionFloat` when the fal.ai video loop
 * is gated off by tier).
 */
export const floatAmplitude = () => ({
  y: move.float,
  scaleMin: scale.breathMin,
  scaleMax: scale.breathMax,
  rotateDeg: rot.sway,
});

/** Type re-exports for downstream files that import from one place. */
export type { Tier, DepthTier, EasingName, DurationName, SpringName } from "./motionTokens";
export { easing, dur, stagger, spring, parallax, cubicBezier, cubicBezierString, gsapEase };