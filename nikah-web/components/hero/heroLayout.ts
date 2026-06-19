/**
 * heroLayout — positions for each hero layer (relative to container).
 * Calibrated to match `scenes/hero-main.webp` reference composition.
 * Values are % of container, mobile-first; adjust per breakpoint if needed.
 */

export interface HeroLayerPosition {
  /** X in % from container left */
  x: number;
  /** Y in % from container top */
  y: number;
  /** Width in % of container */
  w: number;
  /** Optional z-index override */
  z?: number;
}

export const HERO_LAYOUT: Record<string, HeroLayerPosition> = {
  bg: { x: 0, y: 0, w: 100, z: 0 },
  meadow: { x: 0, y: 40, w: 100, z: 1 },
  couple: { x: 22, y: 30, w: 56, z: 2 },

  // 7 cats arranged loosely around the couple; matches hero-main comp.
  "cat-jiro": { x: 14, y: 56, w: 14, z: 3 },
  "cat-meng": { x: 32, y: 62, w: 14, z: 3 },
  "cat-moju": { x: 56, y: 60, w: 14, z: 3 },
  "cat-shiro": { x: 76, y: 58, w: 14, z: 3 },
  "cat-simba": { x: 8, y: 70, w: 12, z: 3 },
  "cat-hoshi": { x: 38, y: 76, w: 12, z: 3 },
  "cat-kimho": { x: 68, y: 76, w: 12, z: 3 },

  "floral-tl": { x: -4, y: -2, w: 36, z: 4 },
  "floral-br": { x: 68, y: 68, w: 36, z: 4 },
};