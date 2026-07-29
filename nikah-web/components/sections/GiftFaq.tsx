"use client";

/**
 * FAQ accordion (copy §9). Tanda Kasih / gift block intentionally omitted —
 * presence and prayers are enough; we do not solicit transfers or gifts.
 */
import { useState } from "react";
import { Reveal } from "@/components/primitives/Reveal";
import { copy } from "@/lib/copy";

export const GiftFaq = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-label="Pertanyaan yang sering diajukan"
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
                  className="flex min-h-[52px] w-full items-center justify-between gap-4 py-4 text-left font-sans text-sm font-medium text-ink"
                >
                  {item.q}
                  <span
                    aria-hidden
                    className={`shrink-0 text-dusty transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                  >
                    ＋
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 font-sans text-sm leading-relaxed text-ink/75">
                      {item.a}
                    </p>
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
