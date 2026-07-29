"use client";

/**
 * L12 — Closing. Primary window `closing-couple-and-cats.webp` (navy groom +
 * family — locked by triage), copy in the warm sky band, Hoshi peeking from
 * the bottom edge on capable tiers. Ken Burns (scale on a *still*) is allowed
 * and GSAP-owned; REDUCED gets the static scene.
 */
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/components/motion/MotionProvider";
import { copy } from "@/lib/copy";

gsap.registerPlugin(ScrollTrigger);

export const Closing = () => {
  const { tier } = useMotion();
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || tier === "REDUCED" || tier === "LOW") return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-closing-scene]",
        { scale: 1 },
        {
          scale: 1.04,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom top", scrub: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [tier]);

  const peeking = tier === "HIGH" || tier === "MID";

  return (
    <section
      ref={root}
      id="closing"
      aria-label="Penutup"
      className="relative overflow-hidden bg-paper"
    >
      <div className="relative overflow-hidden">
        <div data-closing-scene className="relative will-change-transform">
          <Image
            src="/assets/scenes/closing-couple-and-cats.webp"
            alt="Ilustrasi Bashara, Hanifah, dan ketujuh kucing di padang bunga"
            width={1122}
            height={1402}
            sizes="(max-width: 480px) 100vw, 480px"
            className="w-full"
          />
        </div>

        {/* Sky-band copy — short lines only; faces stay unobstructed. */}
        <div className="absolute inset-x-0 top-0 flex flex-col items-center px-10 pt-4 text-center">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-paper/90 via-sky/70 to-transparent"
          />
          <p className="type-lede relative mx-auto max-w-[28ch] text-ink">
            {copy.closing.lines.join(" ")}
          </p>
        </div>

        {/* Hoshi peek — slides up from the bottom edge, occasionally. */}
        {peeking ? (
          <div aria-hidden className="pointer-events-none absolute bottom-0 right-6 w-20 overflow-hidden">
            <Image
              src="/assets/illustrations/closing-hoshi-peek.webp"
              alt=""
              width={433}
              height={577}
              className="w-full animate-[cat-peek_14s_ease-in-out_infinite]"
            />
          </div>
        ) : null}
      </div>

      {/* Emphasis + signature on paper (clears the sticky RSVP pill). */}
      <div className="flex flex-col items-center px-8 pb-32 pt-12 text-center">
        <p className="type-display-sm mx-auto max-w-sm">{copy.closing.emphasis.join(" ")}</p>
        <div aria-hidden className="my-7 h-px w-20 bg-gold/70" />
        <p className="type-display">{copy.closing.names}</p>
        <p className="mt-2 font-serif text-lg italic text-dusty-deep">{copy.closing.hashtag}</p>
      </div>
    </section>
  );
};
