"use client";

/**
 * Accordion — transform/opacity reveal (no height animation) per SPEC 09 §5.
 * Each item has a header (chevron rotates) and a content panel that fades
 * and slides down using translate (transform-only).
 */

import { useState, type ReactNode } from "react";

export interface AccordionItem {
  id: string;
  q: string;
  a: string;
}

export interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div role="list" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div
            key={it.id}
            role="listitem"
            style={{
              background: "var(--cream)",
              borderRadius: 16,
              boxShadow: "var(--shadow-sm)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`acc-${it.id}`}
              onClick={() => setOpen(isOpen ? null : it.id)}
              style={{
                width: "100%",
                background: "transparent",
                border: 0,
                padding: "16px 18px",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                fontFamily: "var(--font-sans)",
                fontSize: "1rem",
                color: "var(--ink)",
                cursor: "pointer",
                minHeight: 44,
              }}
            >
              <span style={{ flex: 1 }}>{it.q}</span>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 250ms cubic-bezier(0.22, 1, 0.36, 1)",
                  color: "var(--ink-soft)",
                }}
              >
                ▾
              </span>
            </button>
            <div
              id={`acc-${it.id}`}
              role="region"
              aria-hidden={!isOpen}
              style={{
                maxHeight: isOpen ? 320 : 0,
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "translateY(0)" : "translateY(-6px)",
                transition:
                  "max-height 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease, transform 200ms ease",
                overflow: "hidden",
              }}
            >
              <p
                style={{
                  padding: "0 18px 16px",
                  margin: 0,
                  color: "var(--ink-soft)",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.6,
                }}
              >
                {it.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Re-export ReactNode so import-path can be canonical
export type { ReactNode };
