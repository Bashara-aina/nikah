"use client";

/**
 * L7 — Japan Dream window. Pure visual breath between the story and the
 * practical act: the sakura campus scene, full-bleed. No copy exists for this
 * section in the locked doc, so it ships textless (see plans/DELTA.md).
 * HIGH tier gets 2–3 drifting petals (CSS, DOM nodes from the accent keeper).
 */
import Image from "next/image";
import { useMotion } from "@/components/motion/MotionProvider";
import { copy } from "@/lib/copy";

const PETALS = [
  { left: "12%", delay: "0s", dur: "11s", size: 34 },
  { left: "58%", delay: "3.5s", dur: "13s", size: 26 },
  { left: "82%", delay: "7s", dur: "12s", size: 30 },
] as const;

export const Japan = () => {
  const { tier } = useMotion();

  return (
    <section
      id="japan"
      aria-label={copy.a11y.japan}
      data-cv="auto"
      className="relative overflow-hidden"
    >
      <Image
        src="/assets/illustrations/japan-sakura-campus.webp"
        alt="Ilustrasi kampus musim sakura di Jepang"
        width={1122}
        height={1402}
        sizes="(max-width: 480px) 100vw, 480px"
        className="w-full"
      />

      {/* Soft paper feather top+bottom so the window sits on the same page. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-paper to-transparent" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-paper to-transparent" />

      {tier === "HIGH" ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {PETALS.map((p) => (
            <Image
              key={p.left}
              src="/assets/florals/japan-petal-accent.webp"
              alt=""
              width={p.size * 4}
              height={Math.round(p.size * 4 * (413 / 337))}
              className="absolute -top-10 h-auto w-[var(--petal-w)] animate-[petal-drift_var(--dur)_linear_infinite]"
              style={{
                left: p.left,
                ["--dur" as string]: p.dur,
                ["--petal-w" as string]: `${p.size}px`,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};
