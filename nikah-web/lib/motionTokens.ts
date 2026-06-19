/**
 * Motion tokens — single source of truth.
 * Mirrors docs/08 §3. Used by every motion primitive so we never hardcode
 * easings/durations/distances anywhere else.
 */

export type Tier = "HIGH" | "MID" | "LOW" | "REDUCED";

export const ease = {
  enter: "cubic-bezier(0.22, 1, 0.36, 1)", // ≈ expo.out
  soft: "power2.inOut",
  float: "sine.inOut",
  settle: "back.out(1.3)",
  exit: "power2.in",
} as const;

export const dur = {
  micro: 0.2, // seconds
  base: 0.5,
  enter: 0.85,
  assemble: 1.5,
  loopSlow: 6,
  loopAmb: 12,
} as const;

export const move = {
  reveal: 28, // px (move.reveal)
  float: 4, // px
  breathe: 0.012, // scale amplitude
  swayDeg: 1.2, // °
  parallaxMax: 24, // px (used by tilt+scroll, scaled per depth tier)
} as const;

export const stagger = {
  tight: 0.06,
  base: 0.1,
  loose: 0.16,
} as const;

export const depth = {
  // parallax factor per layer (docs/08 §4)
  sky: 0.02,
  meadow: 0.06,
  couple: 0.12,
  cat: 0.26,
  foreground: 0.5,
  particles: 0.8,
} as const;

/** particle counts per tier (docs/12). */
export const particleCount: Record<Tier, number> = {
  HIGH: 13,
  MID: 6,
  LOW: 0,
  REDUCED: 0,
};

/** table from docs/08 §7 — used by motionOn() helper. */
export const featureOn = (
  feature:
    | "parallax"
    | "tilt"
    | "scrollParallax"
    | "breathing"
    | "doves"
    | "butterflies"
    | "petals"
    | "blur"
    | "heroAssemble"
    | "loopIdle",
  tier: Tier,
): boolean => {
  if (tier === "REDUCED") return false;
  switch (feature) {
    case "parallax":
    case "tilt":
    case "doves":
    case "butterflies":
    case "petals":
      return tier === "HIGH" || tier === "MID";
    case "scrollParallax":
      return true;
    case "breathing":
      return tier === "HIGH" || tier === "MID"; // LOW: only hero subject, see useTier logic
    case "blur":
      return tier === "HIGH";
    case "heroAssemble":
      return true; // REDUCED already short-circuited above
    case "loopIdle":
      return true;
  }
};