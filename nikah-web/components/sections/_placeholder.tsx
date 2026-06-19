"use client";

/**
 * SectionPlaceholder — minimal placeholder rendered during Stage 1.
 * Each real section (Stage 3+) overrides this with its own choreography.
 * Marked as `client` so we can hook data-anim attributes for Stage 2 reveal.
 */

import type { ReactNode } from "react";

export interface SectionPlaceholderProps {
  id: string;
  title: string;
  note?: string;
  children?: ReactNode;
}

export default function SectionPlaceholder({
  id,
  title,
  note,
  children,
}: SectionPlaceholderProps) {
  return (
    <section
      id={id}
      className="section cv-auto"
      aria-label={title}
      data-section={id}
    >
      <div className="container-narrow">
        <div data-anim data-anim-kind="reveal">
          <h2 className="t-h2 text-[color:var(--ink-soft)]">{title}</h2>
          {note ? (
            <p className="t-body mt-3 text-[color:var(--ink-soft)]">{note}</p>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}