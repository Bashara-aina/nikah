"use client";

/**
 * `Sway` — pure CSS rotate sway for decorative florals and drapery. Zero JS,
 * zero performance cost. Honors `prefers-reduced-motion` via the global
 * reduced-motion media query in `globals.css`.
 */
import { type ReactNode } from "react";
import { rot } from "@/lib/motionTokens";

export const Sway = ({
  children,
  className,
  origin = "bottom center",
}: {
  children: ReactNode;
  className?: string;
  origin?: string;
}) => (
  <div
    className={className}
    style={{
      transformOrigin: origin,
      animation: `sway ${6 + rot.sway}s ease-in-out infinite alternate`,
      willChange: "transform",
    }}
  >
    {children}
  </div>
);