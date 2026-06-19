"use client";

/**
 * ScrollTop — appears after long scroll, smooth scroll to top (Lenis-aware).
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

export default function ScrollTop() {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onScroll = (): void => setVisible(window.scrollY > 1200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = (): void => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo("#top", { duration: 0.9 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Kembali ke atas"
      className="btn-ghost"
      style={{
        position: "fixed",
        left: 16,
        bottom: 24,
        zIndex: 50,
        width: 44,
        height: 44,
        padding: 0,
        borderRadius: "50%",
      }}
      onClick={onClick}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
