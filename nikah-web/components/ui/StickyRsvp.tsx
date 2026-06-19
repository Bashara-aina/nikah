"use client";

/**
 * StickyRsvp — floating pill that scrolls to #rsvp.
 * - Hidden when inside the RSVP section or above the fold
 * - Hidden when document is hidden (offscreen tabs)
 * - Uses Lenis scrollTo if available, otherwise native
 */

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __lenis?: {
      scrollTo: (
        target: HTMLElement | string,
        opts?: { duration?: number; easing?: (t: number) => number },
      ) => void;
    };
  }
}

export default function StickyRsvp() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onScroll = (): void => {
      const rsvpEl = document.getElementById("rsvp");
      if (!rsvpEl) {
        setVisible(false);
        return;
      }
      const rect = rsvpEl.getBoundingClientRect();
      const pastHero = window.scrollY > window.innerHeight * 0.5;
      // Hide when the RSVP section is visible (top edge in or below middle of viewport).
      const rsvpVisible = rect.top < window.innerHeight * 0.5 && rect.bottom > 0;
      setVisible(pastHero && !rsvpVisible);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const onClick = (): void => {
    const el = document.getElementById("rsvp");
    if (!el) return;
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(el, { duration: 0.9 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Konfirmasi kehadiran"
      className="btn-primary"
      style={{
        position: "fixed",
        right: 16,
        bottom: 24,
        zIndex: 50,
        padding: "12px 18px",
        boxShadow: "var(--shadow-md)",
      }}
      onClick={onClick}
    >
      RSVP
    </button>
  );
}
