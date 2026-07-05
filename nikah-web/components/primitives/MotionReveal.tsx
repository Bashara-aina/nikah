"use client";

/**
 * `MotionReveal` — declarative stagger reveal using Motion's variants API.
 *
 * Reads duration, easing, and stagger values from `motionTokens.ts` so the
 * motion vocabulary stays in lockstep with GSAP timelines in the Hero.
 * In `REDUCED` tier, renders children instantly with no transition.
 */
import { motion, type HTMLMotionProps } from "motion/react";
import { useMotion } from "@/components/motion/MotionProvider";
import { revealChildVariants, revealVariants } from "@/lib/motionAdapter";

type DivMotionProps = Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate">;

type MotionRevealProps = DivMotionProps & {
  /** Vertical offset for the children entrance in px. */
  y?: number;
  /** Children stagger spacing in seconds. */
  staggerChildren?: number;
  /** Delay before the first child enters (seconds). */
  delayChildren?: number;
  /** Render as a different element (`section`, `article`, `header`, …). */
  as?: "div" | "section" | "article" | "header" | "main" | "ul" | "ol";
};

export const MotionReveal = ({
  y = 32,
  staggerChildren = 0.1,
  delayChildren = 0.05,
  as = "div",
  children,
  ...rest
}: MotionRevealProps) => {
  const { tier } = useMotion();
  const reduced = tier === "REDUCED";

  const container = revealVariants({
    delayChildren: reduced ? 0 : delayChildren,
    staggerChildren: reduced ? 0 : staggerChildren,
    delay: reduced ? 0 : 0,
  });
  const child = revealChildVariants({ y });

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={reduced ? undefined : container}
      data-tier={tier}
      {...rest}
    >
      {!reduced ? <motion.div variants={child}>{children}</motion.div> : children}
    </MotionTag>
  );
};

/**
 * `MotionRevealItem` — child variant wrapper used inside `MotionReveal`'s
 * subtree so individual items pick up the parent stagger automatically.
 */
export const MotionRevealItem = ({ y = 32, ...rest }: DivMotionProps & { y?: number }) => {
  const { tier } = useMotion();
  if (tier === "REDUCED") {
    return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)} />;
  }
  const variants = revealChildVariants({ y });
  return <motion.div variants={variants} {...rest} />;
};