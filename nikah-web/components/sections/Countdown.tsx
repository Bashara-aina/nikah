"use client";

/**
 * L5 — Countdown window. Full-bleed meadow-path scene with an ivory scrim
 * under the digits; floral band divider sways on capable tiers (CSS).
 * Live values via `useCountdown` — REDUCED just updates numbers, no flips.
 * Heading stays HTML (not baked into the band) for accessibility + scaling.
 */
import Image from "next/image";
import { useMotion } from "@/components/motion/MotionProvider";
import { Reveal } from "@/components/primitives/Reveal";
import { Sway } from "@/components/primitives/Sway";
import { useCountdown } from "@/lib/useCountdown";
import { siteConfig } from "@/lib/config";
import { copy } from "@/lib/copy";

const Unit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex min-w-[4.5rem] flex-col items-center rounded-2xl bg-paper/95 px-3.5 py-3 shadow-petal backdrop-blur-[2px]">
    <span className="font-serif text-[2.35rem] font-medium leading-none tabular-nums tracking-[-0.02em] text-ink">
      {String(value).padStart(2, "0")}
    </span>
    <span className="type-label mt-1.5 text-[0.6rem] tracking-[0.28em] text-ink/80">{label}</span>
  </div>
);

const FloralBand = () => (
  <Image
    src="/assets/illustrations/countdown-floral-band.webp"
    alt=""
    width={816}
    height={273}
    sizes="(max-width: 480px) 100vw, 480px"
    className="h-auto w-[106%] max-w-none"
  />
);

export const Countdown = () => {
  const { tier } = useMotion();
  const { days, hours, minutes } = useCountdown(siteConfig.event.startIso);
  const swaying = tier === "HIGH" || tier === "MID";

  return (
    <section
      id="countdown"
      aria-label="Hitung mundur"
      data-cv="auto"
      className="relative overflow-hidden"
    >
      {/* Window scene */}
      <Image
        src="/assets/scenes/countdown-bg.webp"
        alt=""
        fill
        sizes="(max-width: 480px) 100vw, 480px"
        className="object-cover"
      />
      {/* Ivory veil — meadow stays visible; type never washes into grass. */}
      <div aria-hidden className="absolute inset-0 bg-paper/40" />

      {/* Floral band as the window's top edge — full column width */}
      <div className="pointer-events-none absolute inset-x-0 -top-2 flex justify-center overflow-hidden">
        {swaying ? (
          <Sway origin="top center">
            <FloralBand />
          </Sway>
        ) : (
          <FloralBand />
        )}
      </div>

      <Reveal className="relative z-10 flex min-h-[64svh] flex-col items-center justify-center px-6 pb-20 pt-28 text-center">
        {/* Soft radial veil — not a card; lifts HTML type off busy meadow. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-2 top-[24%] h-44"
          style={{
            background:
              "radial-gradient(ellipse at 50% 42%, rgba(250, 246, 239, 0.88) 0%, rgba(250, 246, 239, 0.42) 52%, transparent 74%)",
          }}
        />
        <p className="relative mx-auto max-w-[22ch] font-serif text-[1.15rem] italic leading-[1.35] tracking-[-0.01em] text-ink">
          {copy.countdown.heading}
        </p>
        <p className="type-display-sm relative mt-1.5 text-ink">
          {copy.countdown.date}
        </p>
        <div className="relative mt-9 flex items-center justify-center gap-2.5" role="timer" aria-live="off">
          <Unit value={days} label={copy.countdown.units.days} />
          <span aria-hidden className="font-serif text-xl text-ink/55">
            ·
          </span>
          <Unit value={hours} label={copy.countdown.units.hours} />
          <span aria-hidden className="font-serif text-xl text-ink/55">
            ·
          </span>
          <Unit value={minutes} label={copy.countdown.units.minutes} />
        </div>
      </Reveal>
    </section>
  );
};
