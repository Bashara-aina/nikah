"use client";

/**
 * Soft act break between major beats (plan 04 §2).
 * Floral + draped-fabric band on transparent alpha — full column width so it
 * reads as a real sectional seam, not a thin floating ribbon.
 */
import Image from "next/image";

export const DraperyDivider = () => (
  <div
    aria-hidden
    className="relative flex w-full items-center justify-center overflow-hidden bg-paper px-0 py-6"
  >
    <Image
      src="/assets/florals/drapery-divider.webp"
      alt=""
      width={1200}
      height={401}
      sizes="(max-width: 480px) 100vw, 480px"
      className="relative z-[1] h-auto w-[108%] max-w-none shrink-0"
    />
  </div>
);
