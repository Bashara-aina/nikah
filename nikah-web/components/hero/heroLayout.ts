/**
 * Hero layer layout — positions each fal.ai video loop relative to the master
 * composition reference (`scenes/hero-main.webp`). Values are placeholders
 * matching the docs/09 layer stack; positions will be calibrated to the actual
 * video frames once Phase 0 (fal.ai asset pipeline) ships.
 *
 * `data-depth` here feeds both `useParallax` (depth-based translate amplitude)
 * and the GSAP assemble timeline (stagger order).
 */
import type { DepthTier } from "@/lib/motionAdapter";

export type HeroLayerKey =
  | "sky"
  | "meadow"
  | "couple"
  | "cats"
  | "floralCorners"
  | "doves"
  | "butterflies"
  | "text";

export type HeroLayerSpec = {
  key: HeroLayerKey;
  /** x position as % of container width. */
  x: number;
  /** y position as % of container height. */
  y: number;
  /** Width as % of container width. */
  width: number;
  /** Height as % of container height. */
  height: number;
  /** Parallax depth tier (0=back, 5=front). */
  depth: DepthTier;
  /** fal.ai video src (relative to /public). Empty until Phase 0 ships. */
  src: string;
  /** WebP poster fallback. */
  poster: string;
  /** GSAP timeline entry point (seconds offset from t=0). */
  entry: number;
};

export const heroLayout: Record<HeroLayerKey, HeroLayerSpec> = {
  sky: {
    key: "sky",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    depth: 0,
    src: "/assets/video/hero-bg-loop.mp4",
    poster: "/assets/scenes/hero-bg.webp",
    entry: 0,
  },
  meadow: {
    key: "meadow",
    x: 0,
    y: 65,
    width: 100,
    height: 35,
    depth: 1,
    src: "/assets/video/meadow-bottom-loop.mp4",
    poster: "/assets/scenes/hero-bg.webp",
    entry: 0.15,
  },
  couple: {
    key: "couple",
    x: 10,
    y: 25,
    width: 80,
    height: 60,
    depth: 2,
    src: "/assets/video/couple-idle.mp4",
    poster: "/assets/couple/couple-cutout.png",
    entry: 0.45,
  },
  cats: {
    key: "cats",
    x: 5,
    y: 55,
    width: 90,
    height: 30,
    depth: 3,
    src: "/assets/video/cats-hero-group-idle.mp4",
    poster: "/assets/scenes/hero-bg.webp",
    entry: 0.7,
  },
  floralCorners: {
    key: "floralCorners",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    depth: 4,
    src: "",
    poster: "",
    entry: 1.05,
  },
  doves: {
    key: "doves",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    depth: 5,
    src: "",
    poster: "/assets/florals/accent-doves.png",
    entry: 1.2,
  },
  butterflies: {
    key: "butterflies",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    depth: 5,
    src: "",
    poster: "/assets/florals/accent-butterflies.png",
    entry: 1.25,
  },
  text: {
    key: "text",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    depth: 5,
    src: "",
    poster: "",
    entry: 1.35,
  },
};