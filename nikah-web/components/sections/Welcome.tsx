"use client";

/**
 * L4 — Welcome + Surah Yasin 36. Dove illustration on paper, greeting,
 * couple + parents (bride-first), and verse below (locked copy §3).
 */
import Image from "next/image";
import { Reveal } from "@/components/primitives/Reveal";
import { copy } from "@/lib/copy";
import { siteConfig } from "@/lib/config";

export const Welcome = () => (
  <section
    id="welcome"
    aria-label={copy.a11y.welcome}
    data-cv="auto"
    className="relative bg-paper px-8 pb-20 pt-16 text-center"
  >
    {/* Alpha artwork — no multiply (plate already keyed); sits directly on paper. */}
    <Reveal>
      <Image
        src="/assets/illustrations/welcome-dove-floral.webp"
        alt=""
        width={1175}
        height={879}
        sizes="(max-width: 480px) 72vw, 340px"
        className="mx-auto h-auto w-[70vw] max-w-[340px] [mask-image:radial-gradient(ellipse_72%_68%_at_50%_48%,black_58%,transparent_80%)]"
      />
    </Reveal>

    <Reveal stagger className="mt-7 flex flex-col items-center gap-5">
      <p className="type-lede mx-auto">{copy.welcome.bismillah}</p>
      {/* The announcement is etiquette, not prose — full ink, centred. */}
      <p className="type-prose mx-auto text-ink">{copy.welcome.lines.join(" ")}</p>

      <div className="mx-auto mt-2 flex max-w-sm flex-col items-center gap-6">
        <div>
          <p className="type-name">{siteConfig.couple.bride}</p>
          <p className="type-meta mx-auto mt-2">{siteConfig.couple.parents.bride}</p>
        </div>
        <p className="font-serif text-lg italic text-muted">&amp;</p>
        <div>
          <p className="type-name">{siteConfig.couple.groom}</p>
          <p className="type-meta mx-auto mt-2">{siteConfig.couple.parents.groom}</p>
        </div>
      </div>

      <div className="relative mt-3 max-w-sm rounded-3xl border border-blush/40 bg-surface/70 px-7 py-8 shadow-petal">
        <Image
          src="/assets/florals/floral-sprig.webp"
          alt=""
          width={442}
          height={127}
          sizes="112px"
          className="pointer-events-none absolute -top-5 left-1/2 h-auto w-28 -translate-x-1/2"
        />
        <blockquote className="type-verse mx-auto">
          {copy.welcome.verse.join(" ")}
        </blockquote>
        <p className="type-label type-label-center mt-5">
          <span aria-hidden>—&nbsp;</span>
          {copy.welcome.verseSource}
        </p>
      </div>
    </Reveal>
  </section>
);
