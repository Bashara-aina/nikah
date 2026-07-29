"use client";

/**
 * L6 — Kisah Kami. Six chapters as polaroids on the ivory page (~85vw, soft
 * shadow, alternating ±tilt — the coherence device locked in plan 04 §1).
 * Copy + images verbatim from `lib/copy.ts`. Static images only — no chapter
 * videos, ever (locked). Scrapbook strip (L6b) follows ch06 as an additive
 * beat: 4 harmonized photos with washi tape + lightbox (plan 05 A.12).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/primitives/Reveal";
import { copy } from "@/lib/copy";

const GALLERY = [
  { src: "/assets/gallery/couple-standing-smiling.webp", tilt: "-rotate-2", w: 1080, h: 1620 },
  { src: "/assets/gallery/couple-overhead-romantic.webp", tilt: "rotate-3", w: 1080, h: 1620 },
  { src: "/assets/gallery/couple-overhead-bouquet.webp", tilt: "rotate-2", w: 1080, h: 1620 },
  { src: "/assets/gallery/couple-overhead-playful.webp", tilt: "-rotate-3", w: 1080, h: 1620 },
] as const;

const Chapter = ({
  index,
  title,
  body,
  image,
}: {
  index: number;
  title: string;
  body: string;
  image: string;
}) => {
  const tilt = index % 2 === 0 ? "-rotate-1" : "rotate-1";
  return (
    <Reveal className="flex flex-col items-center">
      <figure
        className={`w-[85vw] max-w-[380px] rounded-sm bg-surface p-3 pb-5 shadow-card ${tilt}`}
      >
        <Image
          src={image}
          alt={`Ilustrasi: ${title}`}
          width={1254}
          height={1254}
          sizes="(max-width: 480px) 85vw, 380px"
          loading="lazy"
          className="aspect-square w-full rounded-[2px] object-cover"
        />
      </figure>
      <h3 className="type-display-sm mx-auto mt-7 max-w-xs text-center">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-sm text-center font-serif text-[1.05rem] leading-[1.7] tracking-[-0.01em] text-ink/80">
        {body}
      </p>
    </Reveal>
  );
};

const Lightbox = ({
  src,
  onClose,
}: {
  src: string | null;
  onClose: () => void;
}) => {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!src) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Single-control dialog: keep Tab on the close button.
      if (e.key === "Tab") e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [src, onClose]);

  if (!src) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Foto diperbesar"
      className="fixed inset-0 z-modal flex items-center justify-center bg-ink/80 p-6"
      onClick={onClose}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- lightbox shows the already-optimized gallery WebP at natural size */}
      <img src={src} alt="Foto Bashara dan Hanifah" className="max-h-[85svh] max-w-full rounded-lg shadow-float" />
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Tutup foto"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 font-sans text-lg text-ink shadow-card"
      >
        ✕
      </button>
    </div>
  );
};

export const Story = () => {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const close = useCallback(() => setLightbox(null), []);

  return (
    <section
      id="story"
      aria-label="Kisah kami"
      data-cv="auto"
      className="relative bg-paper px-6 pb-20 pt-16"
    >
      {/* Floral corners quietly frame the act. */}
      <Image
        src="/assets/florals/floral-corner-tl.webp"
        alt=""
        width={446}
        height={559}
        sizes="112px"
        className="pointer-events-none absolute left-0 top-0 w-28 opacity-80"
      />

      <Reveal className="text-center">
        <h2 className="type-display">{copy.story.heading}</h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-20 bg-gold/70" />
      </Reveal>

      <div className="mt-14 flex flex-col gap-16">
        {copy.story.chapters.map((ch, i) => (
          <Chapter key={ch.title} index={i} title={ch.title} body={ch.body} image={ch.image} />
        ))}
      </div>

      {/* L6b — scrapbook strip (photos carry the people; no invented captions). */}
      <div className="mt-20 grid grid-cols-2 gap-x-4 gap-y-8 px-2">
        {GALLERY.map((photo) => (
          <Reveal key={photo.src}>
            <button
              onClick={() => setLightbox(photo.src)}
              aria-label="Perbesar foto"
              className={`relative block w-full bg-surface p-2 pb-4 shadow-card transition-transform hover:scale-[1.03] ${photo.tilt}`}
            >
              <Image
                src="/assets/florals/wishes-washi-tape.webp"
                alt=""
                width={866}
                height={288}
                sizes="64px"
                className="pointer-events-none absolute -top-3 left-1/2 z-10 w-16 -translate-x-1/2"
              />
              <Image
                src={photo.src}
                alt="Foto Bashara dan Hanifah"
                width={photo.w}
                height={photo.h}
                sizes="(max-width: 480px) 42vw, 200px"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </button>
          </Reveal>
        ))}
      </div>

      <Image
        src="/assets/florals/floral-corner-br.webp"
        alt=""
        width={247}
        height={353}
        sizes="96px"
        className="pointer-events-none absolute bottom-0 right-0 w-24 opacity-80"
      />

      <Lightbox src={lightbox} onClose={close} />
    </section>
  );
};
