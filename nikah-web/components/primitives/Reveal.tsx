"use client";

/**
 * `Reveal` — declarative wrapper around `useReveal`. Apply to any element that
 * should fade-in + slide-up when scrolled into view. Staggers direct children
 * when `stagger` is true. No-op in REDUCED tier (instant).
 */
import { useRef, type ElementType } from "react";
import { useReveal } from "@/components/motion/useReveal";

type RevealProps = {
  as?: ElementType;
  className?: string;
  stagger?: boolean;
  y?: number;
  start?: string;
  children: React.ReactNode;
};

export const Reveal = ({
  as: Tag = "div",
  className,
  stagger = false,
  y = 32,
  start = "top 80%",
  children,
}: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  useReveal(ref as React.RefObject<HTMLElement | null>, { stagger, y, start });

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};