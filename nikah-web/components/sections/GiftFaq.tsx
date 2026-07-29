"use client";

/**
 * FAQ accordion (copy §9). Tanda Kasih / gift block intentionally omitted —
 * presence and prayers are enough; we do not solicit transfers or gifts.
 */
import { useState } from "react";
import { Reveal } from "@/components/primitives/Reveal";
import { copy } from "@/lib/copy";

/* Drawn rather than typed. This was a fullwidth `＋` (U+FF0B) — a CJK glyph
 * that falls back to a different font on most Latin systems, so it rendered at
 * the wrong weight and sat off the optical centre of the row. */
const PlusGlyph = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    className={`shrink-0 text-dusty-deep transition-transform duration-300 ${open ? "rotate-45" : ""}`}
  >
    <path d="M8 2v12M2 8h12" />
  </svg>
);

export const GiftFaq = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-label={copy.a11y.faq}
      data-cv="auto"
      className="bg-paper px-7 pb-20 pt-16 text-center"
    >
      <Reveal className="mx-auto max-w-sm text-left">
        <h2 className="type-display text-center">{copy.faq.heading}</h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-20 bg-gold/70" />
        <div className="mt-7 flex flex-col divide-y divide-border border-y border-border">
          {copy.faq.items.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  aria-expanded={open}
                  className="type-body flex min-h-[52px] w-full max-w-none items-center justify-between gap-4 py-4 text-left font-medium text-ink"
                >
                  {item.q}
                  <PlusGlyph open={open} />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="type-body pb-5">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
};
