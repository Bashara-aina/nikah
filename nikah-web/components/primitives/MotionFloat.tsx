"use client";

/**
 * `MotionFloat` — continuous breathing / float loop, used as the **fallback**
 * idle for cat + couple characters when the fal.ai video loop is gated off
 * (`MID | LOW` tiers where poster fallback is shown). The primary idle motion
 * always lives in the video; this primitive is intentionally subtle and slow
 * so it never fights the GSAP master timeline.
 */
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { useState, type ReactNode } from "react";
import { floatAmplitude } from "@/lib/motionAdapter";
import { useMotion } from "@/components/motion/MotionProvider";
import { dur, spring } from "@/lib/motionTokens";

type DivMotionProps = Omit<HTMLMotionProps<"div">, "animate" | "initial" | "children">;

export const MotionFloat = ({
  phaseSeed,
  children,
  ...rest
}: DivMotionProps & { phaseSeed?: number; children?: ReactNode }) => {
  const { tier } = useMotion();
  const reduceMotion = useReducedMotion();
  // Compute the per-instance offset once via lazy initial state. The linter
  // treats `useState` initializers as pure render-time expressions.
  const [offsetSeconds] = useState<number>(() => {
    const seed = phaseSeed ?? Math.random();
    return seed % 1;
  });

  const amp = floatAmplitude();

  if (reduceMotion || tier === "REDUCED") {
    return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ y: 0, scale: amp.scaleMin, rotate: 0 }}
      animate={{
        y: [0, -amp.y, 0, amp.y, 0],
        scale: [amp.scaleMin, amp.scaleMax, amp.scaleMin],
        rotate: [-amp.rotateDeg, amp.rotateDeg, -amp.rotateDeg],
      }}
      transition={{
        duration: dur.loopSlow,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "mirror",
        delay: offsetSeconds,
        ...spring.gentle,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};