"use client";

/**
 * L1 — Loading. Sleeping cat on ivory with a CSS breath (HIGH/MID), static on
 * LOW/REDUCED. Shows for a short calm beat while the gate art warms the cache.
 * Copy: locked §0 (hashtag only).
 */
import Image from "next/image";
import { motion } from "motion/react";
import { useMotion } from "@/components/motion/MotionProvider";
import { copy } from "@/lib/copy";
import { dur } from "@/lib/motionTokens";

export const Loading = () => {
  const { tier } = useMotion();
  const breathe = tier === "HIGH" || tier === "MID";

  return (
    <motion.div
      key="loading"
      role="status"
      aria-label="Memuat undangan"
      exit={{ opacity: 0 }}
      transition={{ duration: tier === "REDUCED" ? 0 : dur.base }}
      className="fixed inset-0 z-modal flex flex-col items-center justify-center bg-paper px-6"
    >
      <div
        className={`bg-paper ${breathe ? "breathing-element" : ""}`}
        style={{ ["--breath-dur" as string]: "3000ms" }}
      >
        <Image
          src="/assets/illustrations/loading-sleeping-cat.webp"
          alt=""
          width={1000}
          height={1000}
          priority
          sizes="(max-width: 480px) 58vw, 280px"
          className="h-auto w-[58vw] max-w-[280px] [mask-image:radial-gradient(circle,black_58%,transparent_74%)]"
        />
      </div>
      <p className="mt-6 font-serif text-lg italic tracking-[-0.01em] text-ink/90">
        {copy.loading.hashtag}
      </p>
    </motion.div>
  );
};
