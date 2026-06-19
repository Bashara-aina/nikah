"use client";

/**
 * Pill — radio-style choice used in RSVP kehadiran (SPEC 09 §5).
 * Selected → bg peach/blush, scale settle. Fully keyboard accessible.
 */

import type { ReactNode } from "react";

export interface PillProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  ariaLabel?: string;
}

export default function Pill({
  selected,
  onClick,
  children,
  ariaLabel,
}: PillProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      onClick={onClick}
      className="pill"
      style={{
        background: selected ? "var(--peach)" : "transparent",
        color: "var(--ink)",
        border: `1px solid ${
          selected
            ? "color-mix(in srgb, var(--dusty) 60%, transparent)"
            : "color-mix(in srgb, var(--sage) 50%, transparent)"
        }`,
        borderRadius: 999,
        padding: "10px 18px",
        minHeight: 44,
        fontFamily: "var(--font-sans)",
        fontSize: "0.95rem",
        cursor: "pointer",
        transition:
          "transform 200ms cubic-bezier(0.22, 1, 0.36, 1), background-color 200ms ease, border-color 200ms ease",
        transform: selected ? "scale(1.04)" : "scale(1)",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        boxShadow: selected ? "var(--shadow-sm)" : "none",
      }}
    >
      {selected ? <span aria-hidden="true">✓</span> : null}
      <span>{children}</span>
    </button>
  );
}
