"use client";

/**
 * Sticky RSVP pill — appears once the guest scrolls past the hero, hides in
 * the RSVP / FAQ / closing quiet zone so it never covers practical copy.
 */
import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";

const EnvelopeIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    width="14"
    height="14"
    className="shrink-0 opacity-90"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="M3.5 7.5 12 13.25 20.5 7.5" />
  </svg>
);

export const StickyRsvp = () => {
  const [pastHero, setPastHero] = useState(false);
  const [inQuietZone, setInQuietZone] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const quietIds = ["rsvp", "faq", "closing"] as const;
    const quietEls = quietIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!hero || quietEls.length === 0) return;

    const heroObs = new IntersectionObserver(
      ([entry]) => setPastHero(!(entry?.isIntersecting ?? true)),
      { threshold: 0.05 },
    );
    const visibleQuiet = new Set<string>();
    const quietObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visibleQuiet.add(id);
          else visibleQuiet.delete(id);
        }
        setInQuietZone(visibleQuiet.size > 0);
      },
      { threshold: 0.12 },
    );
    heroObs.observe(hero);
    quietEls.forEach((el) => quietObs.observe(el));
    return () => {
      heroObs.disconnect();
      quietObs.disconnect();
    };
  }, []);

  const visible = pastHero && !inQuietZone;

  return (
    <a
      href="#rsvp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`type-button fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-sticky flex min-h-[44px] -translate-x-1/2 items-center gap-2.5 rounded-full bg-ink px-6 py-2.5 text-paper shadow-float transition-[opacity,transform] duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-16 opacity-0"
      }`}
    >
      <EnvelopeIcon />
      {/* Short form — the full "Konfirmasi Kehadiran" runs past the pill once
          it picks up the button tracking. */}
      <span className="leading-none">{copy.rsvp.pill}</span>
    </a>
  );
};
