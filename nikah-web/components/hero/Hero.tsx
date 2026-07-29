"use client";

/**
 * L3 — Hero. One full-bleed living illustration: `hero-bg-loop.mp4` with the
 * dedicated first-frame poster (GG-Hero: both share `hero-main.webp` framing).
 *
 * Motion ownership (plan 03 §3 — locked):
 *   - fal video owns all character/scene life. No transform/filter animation
 *     on the <video> or any wrapper that moves painted characters.
 *   - Motion owns the text entrance (staggered, after the gate exits).
 *   - GSAP owns the text scroll-out fade (scrub) — text only, never the video.
 *   - LOW/REDUCED tiers see the poster (useVideoLayer pauses playback).
 */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/components/motion/MotionProvider";
import { Particles } from "@/components/motion/Particles";
import { VideoLayer } from "@/components/primitives/VideoLayer";
import { MotionReveal, MotionRevealItem } from "@/components/primitives/MotionReveal";
import { gsapEase } from "@/lib/motionAdapter";
import { stagger as staggerToken } from "@/lib/motionTokens";
import { siteConfig } from "@/lib/config";
import { copy } from "@/lib/copy";

gsap.registerPlugin(ScrollTrigger);

const HERO_VIDEO = "/assets/video/hero-bg-loop.mp4";
const HERO_POSTER = "/assets/video/hero-bg-loop-poster.jpg";
/** Visible video-sky sample at the clip edge (brighter than poster row-0). */
const HERO_SKY_EDGE = "#d1e6f0";
const HERO_SKY_EDGE_RGB = "209, 230, 240";
/** Video is aspect 4/5 → height = width × 1.25; sky-band bottom inset uses a
 *  smaller factor so the painted band overlaps the video's empty sky. */
const HERO_SKY_BAND_BOTTOM_FACTOR = 0.98;
const HERO_VIDEO_HEIGHT_FACTOR = 1.25;

export const Hero = () => {
  const { tier } = useMotion();
  const root = useRef<HTMLElement | null>(null);
  const [hintVisible, setHintVisible] = useState(false);

  // Scroll hint appears after a short idle beat (plan 05 A.10).
  useEffect(() => {
    const id = window.setTimeout(() => setHintVisible(true), 3000);
    return () => window.clearTimeout(id);
  }, []);

  // Text scroll-out — GSAP scrub on the text block only.
  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl || tier === "REDUCED") return;

    const ctx = gsap.context(() => {
      gsap.to("[data-hero-text]", {
        opacity: 0,
        y: -24,
        ease: gsapEase("exit"),
        scrollTrigger: {
          trigger: rootEl,
          start: "top top",
          end: "45% top",
          scrub: true,
        },
      });
    }, rootEl);
    return () => ctx.revert();
  }, [tier]);

  return (
    <section
      ref={root}
      id="hero"
      data-tier={tier}
      aria-label={`${siteConfig.couple.bride} dan ${siteConfig.couple.groom}`}
      className="relative isolate h-[100svh] w-full overflow-hidden bg-paper"
    >
      {/* Base wash — ends at the visible video-sky tone so a feathered clip
          edge has no color cliff to reveal. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, #a9d3ec 0%, #c0dff2 48%, ${HERO_SKY_EDGE} 100%)`,
        }}
      />

      {/* Living meadow — full artwork anchored to the bottom; video owns all
          character motion. Soft top mask kills the hard clip edge where the
          painted sky meets the CSS wash / sky band. */}
      <div className="absolute inset-x-0 bottom-0">
        <div
          className="relative aspect-[4/5] w-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_24%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_24%)] [mask-size:100%_100%] [mask-repeat:no-repeat] [-webkit-mask-size:100%_100%] [-webkit-mask-repeat:no-repeat]"
        >
          <VideoLayer
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Painted sky band — deeper overlap + longer fade so the cross-dissolve
          sits over the video's empty sky, not above the junction. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 [mask-image:linear-gradient(to_bottom,black_48%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_48%,transparent_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] [-webkit-mask-size:100%_100%] [-webkit-mask-repeat:no-repeat]"
        style={{
          bottom: `calc(min(100vw, 480px) * ${HERO_SKY_BAND_BOTTOM_FACTOR})`,
        }}
      >
        <Image
          src="/assets/scenes/hero-sky-band.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover object-bottom"
        />
      </div>

      {/* Seam veil — light sky wash across the clip edge; kept translucent so it
          softens the step without painting a milky horizontal band. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: `calc(100% - min(100vw, 480px) * ${HERO_VIDEO_HEIGHT_FACTOR - 0.08})`,
          height: `calc(min(100vw, 480px) * 0.32)`,
          background: `linear-gradient(to bottom, rgba(${HERO_SKY_EDGE_RGB}, 0.55) 0%, rgba(${HERO_SKY_EDGE_RGB}, 0.28) 40%, rgba(${HERO_SKY_EDGE_RGB}, 0.1) 70%, transparent 100%)`,
        }}
      />

      {/* Ambient petals above the video (GSAP/DOM layer — allowed above video). */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Particles />
      </div>

      {/* Text — centered in the sky zone (CSS sky + the artwork's own empty
          sky top), so no dead band opens on tall phones. Faces stay clear. */}
      <div
        data-hero-text
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center justify-center px-5 text-center"
        style={{ bottom: "calc(min(100vw, 480px) * 1.25 - 3.5rem)" }}
      >
        {/* Soft sky scrim — keeps small caps + date ≥AA when video sky shifts. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-[18%] bottom-[28%] rounded-[2rem]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, rgba(185, 220, 243, 0.72) 0%, rgba(185, 220, 243, 0.28) 55%, transparent 78%)",
          }}
        />
        <MotionReveal
          as="div"
          className="relative flex max-w-[22rem] flex-col items-center"
          delayChildren={0.35}
          staggerChildren={staggerToken.base}
          y={14}
        >
          <MotionRevealItem className="type-kicker text-ink">
            {copy.hero.kicker}
          </MotionRevealItem>
          <MotionRevealItem className="type-name mt-2.5">
            {siteConfig.couple.bride}
          </MotionRevealItem>
          <MotionRevealItem className="mt-0.5 pb-1 font-serif text-lg italic leading-[1.2] text-ink-soft">
            &amp;
          </MotionRevealItem>
          <MotionRevealItem className="type-name">
            {siteConfig.couple.groom}
          </MotionRevealItem>
          <MotionRevealItem className="type-datemark mt-3">
            {copy.hero.dateDisplay}
          </MotionRevealItem>
        </MotionReveal>
      </div>

      {/* Scroll hint — appears after idle, gentle float. */}
      <div
        aria-hidden
        className={`absolute inset-x-0 bottom-6 z-10 flex justify-center transition-opacity duration-700 ${
          hintVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className={`flex h-11 w-7 items-start justify-center rounded-full border border-paper/80 p-1.5 ${
            tier === "REDUCED" || tier === "LOW" ? "" : "breathing-element"
          }`}
          style={{ ["--breath-dur" as string]: "2400ms" }}
        >
          <div className="h-2 w-1 rounded-full bg-paper/90" />
        </div>
      </div>
    </section>
  );
};
