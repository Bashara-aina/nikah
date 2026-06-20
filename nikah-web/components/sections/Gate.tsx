"use client";

/**
 * Gate — opening storybook page.
 *
 * Motion allocation:
 *   - `motion.h1` / `motion.p` / `motion.button` drive the children entrance
 *     with values from `motionTokens.ts` (cubic-bezier "enter" easing).
 *   - The page-turn / curtain swap to Hero is an `AnimatePresence` with the
 *     floral border using a shared `layoutId` so the asset animates between
 *     pages rather than fading abruptly.
 *
 * GSAP allocation: none on this screen — the gate is a pure declaration layer
 * so the entrance reads soft, and the Hero timeline below it owns the next beat.
 *
 * On tap "Buka Undangan":
 *   1. Request gyro permission (iOS 13+) — the useGyro hook listens for this.
 *   2. Fade in La Vie en Rose audio (GSAP fade 0→0.5 over `audio.fadeInMs`).
 *   3. Flip `open` → `AnimatePresence` exits the gate and the Hero assembles.
 */
import { useState } from "react";
import { AnimatePresence, motion, type Variants, type Easing } from "motion/react";
import { gsap } from "gsap";
import { useMotion } from "@/components/motion/MotionProvider";
import { motionSpring, cubicBezierString } from "@/lib/motionAdapter";
import { siteConfig } from "@/lib/config";
import { guestNameFromSearchParams } from "@/lib/guest";
import { dur } from "@/lib/motionTokens";

const ENTER_EASING: Easing = cubicBezierString("enter") as Easing;

export const Gate = () => {
  const { tier } = useMotion();
  const [open, setOpen] = useState<boolean>(false);
  // Read the URL once on mount; if `?to=` is present the guest name is decoded
  // here, otherwise the default is used. SSR-safe: `window` is checked first.
  const [guestName] = useState<string>(() => {
    if (typeof window === "undefined") return "Bapak/Ibu/Saudara/i";
    const params = new URLSearchParams(window.location.search);
    return guestNameFromSearchParams(Object.fromEntries(params));
  });

  const handleOpen = async () => {
    // 1. iOS 13+ gyro permission — useGyro will pick up the granted state.
    const orientationWithPermission = (
      DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      }
    ).requestPermission;
    if (typeof orientationWithPermission === "function") {
      try {
        await orientationWithPermission();
      } catch {
        /* user denied — gyro hook will be a no-op */
      }
    }

    // 2. Audio fade-in. Skip if no src.
    const audio = document.querySelector<HTMLAudioElement>("audio.site-audio");
    if (audio) {
      audio.volume = 0;
      try {
        await audio.play();
        gsap.to(audio, {
          volume: siteConfig.audio.fadeTarget,
          duration: siteConfig.audio.fadeInMs / 1000,
          ease: cubicBezierString("enter"),
        });
      } catch {
        /* autoplay blocked — user gesture might not have been registered */
      }
    }

    // 3. Flip state — AnimatePresence handles the page-turn exit.
    setOpen(true);
  };

  const reduced = tier === "REDUCED";
  const containerAnim = reduced ? undefined : "visible";
  const containerInitial = reduced ? false : "hidden";

  return (
    <AnimatePresence mode="wait">
      {!open ? (
        <motion.section
          key="gate"
          id="gate"
          role="dialog"
          aria-modal="true"
          aria-label="Buka undangan"
          data-tier={tier}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: reduced ? 1 : 1.04 }}
          transition={{ duration: reduced ? 0 : dur.base, ease: ENTER_EASING }}
          className="fixed inset-0 z-modal flex items-center justify-center bg-paper px-6 text-center"
        >
          {/* Floral border — shared `layoutId` with the Hero page-turn. */}
          <motion.div
            layoutId="gate-border"
            aria-hidden
            className="pointer-events-none absolute inset-4 rounded-[3rem] border border-blush/40 sm:inset-8"
          />

          <motion.div
            initial={containerInitial}
            animate={containerAnim}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  delayChildren: 0.15,
                  staggerChildren: 0.12,
                },
              },
            }}
            className="relative z-10 flex max-w-prose flex-col items-center"
          >
            <motion.p
              variants={reduced ? undefined : item}
              className="font-serif text-base italic text-ink/70"
            >
              The Wedding of
            </motion.p>
            <motion.h1
              variants={reduced ? undefined : item}
              className="mt-2 font-serif text-4xl font-medium tracking-editorial text-ink sm:text-5xl"
            >
              {siteConfig.couple.groom} &amp; {siteConfig.couple.bride}
            </motion.h1>

            <motion.div
              variants={reduced ? undefined : item}
              className="my-8 h-px w-24 bg-gold/60"
              aria-hidden
            />

            <motion.p
              variants={reduced ? undefined : item}
              className="font-sans text-xs uppercase tracking-[0.3em] text-ink/60"
            >
              Kepada yang terkasih,
            </motion.p>
            <motion.p
              variants={reduced ? undefined : item}
              className="mt-2 font-serif text-2xl font-medium text-ink sm:text-3xl"
            >
              {guestName}
            </motion.p>
            <motion.p
              variants={reduced ? undefined : item}
              className="mt-6 max-w-md font-serif text-base italic leading-relaxed text-ink/80"
            >
              Dengan penuh syukur, kami mengundangmu untuk menjadi bagian dari
              hari bahagia kami.
            </motion.p>

            <motion.button
              variants={reduced ? undefined : item}
              onClick={handleOpen}
              transition={motionSpring("gentle")}
              whileHover={reduced ? undefined : { scale: 1.03 }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              className="mt-10 inline-flex min-h-[44px] items-center rounded-full border border-ink/30 bg-cream px-8 py-3 font-sans text-sm uppercase tracking-[0.25em] text-ink shadow-sm transition-colors hover:bg-blush/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Buka Undangan
            </motion.button>
          </motion.div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.base, ease: ENTER_EASING },
  },
};