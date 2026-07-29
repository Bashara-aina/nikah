"use client";

/**
 * L2 — Gate (storybook cover). The single ritual unlock (L0 envelope collapsed
 * into gate-first — see relevant/plans/DELTA.md).
 *
 * Motion allocation:
 *   - Motion drives the children entrance stagger + AnimatePresence exit
 *     (the parent Invitation unmounts the Gate on open).
 *   - CSS owns the floral border sway/breath (HIGH/MID only).
 *   - GSAP owns nothing here — audio fade lives in AudioProvider.
 *
 * On tap "Buka Undangan":
 *   1. iOS 13+ gyro permission (inside the gesture).
 *   2. `unlock()` — La Vie en Rose fade-in via AudioProvider.
 *   3. `onOpen()` — parent flips phase; AnimatePresence exits the gate.
 */
import { useState } from "react";
import Image from "next/image";
import { motion, type Variants, type Easing } from "motion/react";
import { useMotion } from "@/components/motion/MotionProvider";
import { useSiteAudio } from "@/components/AudioProvider";
import { motionEase, motionSpring } from "@/lib/motionAdapter";
import { dur } from "@/lib/motionTokens";
import { siteConfig } from "@/lib/config";
import { copy } from "@/lib/copy";
import { guestNameFromSearchParams } from "@/lib/guest";

const ENTER_EASING: Easing = motionEase("enter");

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: dur.base, ease: ENTER_EASING },
  },
};

export const Gate = ({ onOpen }: { onOpen: () => void }) => {
  const { tier } = useMotion();
  const { unlock } = useSiteAudio();
  const [opening, setOpening] = useState(false);
  const [guestName] = useState<string>(() => {
    if (typeof window === "undefined") return "Bapak/Ibu/Saudara/i";
    const params = new URLSearchParams(window.location.search);
    return guestNameFromSearchParams(Object.fromEntries(params));
  });

  const reduced = tier === "REDUCED";
  const swaying = tier === "HIGH" || tier === "MID";

  const handleOpen = async () => {
    if (opening) return;
    setOpening(true);

    // 1. iOS 13+ gyro permission — must happen inside the tap gesture.
    // Cap wait so a stuck permission dialog cannot freeze the unlock ritual.
    const requestPermission = (
      DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      }
    ).requestPermission;
    if (typeof requestPermission === "function") {
      try {
        await Promise.race([
          requestPermission(),
          new Promise<void>((resolve) => {
            window.setTimeout(resolve, 1200);
          }),
        ]);
      } catch {
        /* denied — gyro parallax stays off */
      }
    }

    // 2. Audio unlock + fade (AudioProvider owns the tween).
    unlock();

    // 3. Hand the beat to the parent — AnimatePresence exits this section.
    try {
      window.sessionStorage.setItem("nikah:opened", "1");
    } catch {
      /* ignore */
    }
    onOpen();
  };

  return (
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
      transition={{ duration: reduced ? 0 : dur.enter, ease: ENTER_EASING }}
      className="fixed inset-0 z-modal flex items-center justify-center overflow-hidden bg-paper"
    >
      {/* Floral border frame — keeper art, breathes gently on capable tiers. */}
      <div className="pointer-events-none absolute inset-0 mx-auto w-full max-w-[480px]">
        <Image
          src="/assets/illustrations/gate-floral-border.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className={`object-contain object-center opacity-[0.92] ${swaying ? "breathing-element" : ""}`}
          style={{ ["--breath-dur" as string]: "7200ms" }}
        />
      </div>

      <motion.div
        initial={reduced ? false : "hidden"}
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delayChildren: 0.2, staggerChildren: 0.12 },
          },
        }}
        className="relative z-10 flex w-full max-w-[420px] flex-col items-center px-10 py-12 text-center"
      >
        {/* Paper veil under copy — florals stay visible; italic lede stays readable. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-10 top-[38%] rounded-[2rem] bg-paper/75"
        />
        {/* Monogram wreath — alpha keeper; soft edge mask only (no multiply). */}
        <motion.div variants={reduced ? undefined : item} className="relative">
          <Image
            src="/assets/illustrations/gate-monogram-frame.webp"
            alt=""
            width={1000}
            height={1000}
            priority
            sizes="(max-width: 480px) 42vw, 190px"
            className="h-auto w-[42vw] max-w-[190px] [mask-image:radial-gradient(circle,black_62%,transparent_78%)]"
          />
          <span
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-medium tracking-widest text-ink"
          >
            H&thinsp;&amp;&thinsp;B
          </span>
        </motion.div>

        <motion.p
          variants={reduced ? undefined : item}
          className="relative type-kicker mt-5 text-ink"
        >
          {copy.gate.kicker}
        </motion.p>
        <motion.h1
          variants={reduced ? undefined : item}
          className="relative type-display mt-2"
        >
          {siteConfig.couple.short}
        </motion.h1>

        <motion.div
          variants={reduced ? undefined : item}
          aria-hidden
          className="relative my-5 h-px w-20 bg-gold/70"
        />

        <motion.p
          variants={reduced ? undefined : item}
          className="relative type-label"
        >
          {copy.gate.dear}
        </motion.p>
        <motion.p
          variants={reduced ? undefined : item}
          className="relative type-name mt-2"
        >
          {guestName}
        </motion.p>
        <motion.p
          variants={reduced ? undefined : item}
          className="relative type-lede mx-auto mt-5 text-ink"
        >
          {copy.gate.invitation}
        </motion.p>

        <motion.button
          variants={reduced ? undefined : item}
          onClick={handleOpen}
          disabled={opening}
          transition={motionSpring("gentle")}
          whileHover={reduced ? undefined : { scale: 1.03 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          className="relative mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-dusty/50 bg-surface px-9 py-3 font-sans text-sm uppercase tracking-[0.25em] text-ink shadow-petal transition-colors hover:bg-blush/25 active:scale-[0.97] disabled:opacity-70"
        >
          {opening ? (
            <span
              aria-hidden
              className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink"
            />
          ) : null}
          {copy.gate.cta}
        </motion.button>
      </motion.div>
    </motion.section>
  );
};
