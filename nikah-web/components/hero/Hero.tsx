"use client";

/**
 * Hero — assembles the layered, living scene per `docs/09-hero-choreography.md`.
 *
 * Motion allocation:
 *   - Motion `Reveal` / `MotionReveal` handle the per-character micro-entrance
 *     and the staggered text fade-in.
 *   - Motion's `useReducedMotion` short-circuits all entrance when active.
 *
 * GSAP allocation (unchanged from spec):
 *   - Master assemble timeline (opacity + translateY per layer per docs/09 §2).
 *   - ScrollTrigger parallax wired into `useParallax`.
 *   - Doves & Butterflies via separate components.
 */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useMotion } from "@/components/motion/MotionProvider";
import { useParallax } from "@/components/motion/useParallax";
import { VideoLayer } from "@/components/primitives/VideoLayer";
import { MotionReveal, MotionRevealItem } from "@/components/primitives/MotionReveal";
import { Doves } from "./Doves";
import { Butterflies } from "./Butterflies";
import { heroLayout, type HeroLayerSpec } from "./heroLayout";
import {
  cubicBezierString,
  dur,
  stagger as staggerToken,
} from "@/lib/motionTokens";
import { siteConfig } from "@/lib/config";

gsap.registerPlugin(ScrollTrigger);

const ORDERED_LAYERS: readonly HeroLayerSpec[] = [
  heroLayout.sky,
  heroLayout.meadow,
  heroLayout.couple,
  heroLayout.cats,
];

export const Hero = () => {
  const { tier } = useMotion();
  const reduceMotion = useReducedMotion();
  const root = useRef<HTMLElement | null>(null);
  const parallax = useParallax();
  const textReduceMotion = reduceMotion ?? tier === "REDUCED";

  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;
    if (tier === "REDUCED") return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: cubicBezierString("enter") } });

      for (const layer of ORDERED_LAYERS) {
        const el = rootEl.querySelector<HTMLElement>(`[data-layer="${layer.key}"]`);
        if (!el) continue;
        tl.fromTo(
          el,
          { opacity: 0, y: layer.key === "couple" ? 40 : 20, scale: layer.key === "couple" ? 0.96 : 1 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: layer.key === "couple" ? dur.base + 0.3 : dur.base + 0.5,
            ease: layer.key === "couple" ? "back.out(1.3)" : cubicBezierString("enter"),
          },
          layer.entry,
        );
      }

      // Hero exit — fade out as the next section enters viewport.
      gsap.to(rootEl, {
        opacity: 0,
        ease: cubicBezierString("exit"),
        scrollTrigger: {
          trigger: rootEl,
          start: "bottom 60%",
          end: "bottom 0%",
          scrub: true,
        },
      });
    }, rootEl);

    return () => ctx.revert();
  }, [tier]);

  const parallaxStyle = (depth: HeroLayerSpec["depth"]) => ({
    transform: parallax[depth],
    willChange: "transform" as const,
  });

  return (
    <section
      ref={root}
      id="hero"
      data-tier={tier}
      className="relative isolate h-[100svh] w-full overflow-hidden bg-paper"
      aria-label="Bashara dan Hanifah"
    >
      {/* Layer 0 — sky / hero bg loop */}
      <div
        data-layer="sky"
        className="absolute inset-0"
        style={parallaxStyle(0)}
      >
        <VideoLayer
          src={heroLayout.sky.src}
          poster={heroLayout.sky.poster}
          depth={0}
          preload="metadata"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Layer 1 — meadow bottom */}
      <div
        data-layer="meadow"
        className="absolute inset-0"
        style={parallaxStyle(1)}
      >
        <VideoLayer
          src={heroLayout.meadow.src}
          poster={heroLayout.meadow.poster}
          depth={1}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Layer 2 — couple */}
      <div
        data-layer="couple"
        className="absolute inset-0"
        style={parallaxStyle(2)}
      >
        <VideoLayer
          src={heroLayout.couple.src}
          poster={heroLayout.couple.poster}
          depth={2}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Layer 3 — cats (group idle) */}
      <div
        data-layer="cats"
        className="absolute inset-0"
        style={parallaxStyle(3)}
      >
        <VideoLayer
          src={heroLayout.cats.src}
          poster={heroLayout.cats.poster}
          depth={3}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Particles (depth 5) */}
      <div className="pointer-events-none absolute inset-0" style={parallaxStyle(5)}>
        {/* Particles component rendered in page.tsx since it shares the same surface. */}
      </div>

      {/* Doves (GSAP MotionPath) */}
      <Doves />

      {/* Butterflies (GSAP MotionPath + scaleX flutter) */}
      <Butterflies />

      {/* Text — staggered entrance last per docs/09 §2. */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <MotionReveal
          as="div"
          className="pointer-events-auto flex max-w-prose flex-col items-center"
          delayChildren={heroLayout.text.entry}
          staggerChildren={staggerToken.base}
          y={12}
        >
          <MotionRevealItem className="font-serif text-base italic text-ink/70">
            The Wedding of
          </MotionRevealItem>
          <MotionRevealItem className="mt-2 font-serif text-5xl font-medium tracking-editorial text-ink sm:text-6xl">
            {siteConfig.couple.short}
          </MotionRevealItem>
          <MotionRevealItem className="mt-3 font-sans text-sm uppercase tracking-[0.3em] text-ink/70">
            {siteConfig.event.dateLabel}
          </MotionRevealItem>
          <MotionRevealItem className="mt-6 max-w-md font-serif text-base italic text-ink/80 sm:text-lg">
            We are getting married.
          </MotionRevealItem>
        </MotionReveal>
      </div>

      {/* Reduced-motion safe-text instant fallback (no opacity tricks). */}
      {textReduceMotion && (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
          <p className="font-serif text-base italic text-ink/70">The Wedding of</p>
          <p className="mt-2 font-serif text-5xl font-medium tracking-editorial text-ink sm:text-6xl">
            {siteConfig.couple.short}
          </p>
          <p className="mt-3 font-sans text-sm uppercase tracking-[0.3em] text-ink/70">
            {siteConfig.event.dateLabel}
          </p>
        </div>
      )}
    </section>
  );
};