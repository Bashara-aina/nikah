"use client";

/**
 * L8 — Event details. Airy vertical stack (date → times → venue sketch →
 * name/address → CTAs → hand-drawn map). Copy verbatim §6.
 */
import Image from "next/image";
import { Reveal } from "@/components/primitives/Reveal";
import { calendarUrl, siteConfig } from "@/lib/config";
import { copy } from "@/lib/copy";

const Cta = ({
  href,
  children,
  variant = "outline",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "outline" | "solid";
}) => {
  const base =
    "type-label inline-flex min-h-[44px] items-center justify-center rounded-full px-7 py-2.5 transition-transform active:scale-[0.97]";
  const styles =
    variant === "solid"
      ? "bg-dusty-deep text-paper shadow-petal hover:opacity-90"
      : "border border-dusty/40 bg-surface text-ink shadow-petal hover:bg-blush/25";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${styles}`}
    >
      {children}
    </a>
  );
};

export const EventDetails = () => {
  const livestream = Object.entries(siteConfig.livestream).filter(([, url]) => url !== "");

  return (
    <section
      id="event"
      aria-label="Detail acara"
      data-cv="auto"
      className="bg-paper px-8 pb-24 pt-16 text-center"
    >
      <Reveal>
        <h2 className="type-display">{copy.event.heading}</h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-20 bg-gold/70" />
      </Reveal>

      {/* Date — breathing room above the schedule blocks */}
      <Reveal className="mt-14">
        <p className="font-serif text-[1.25rem] font-medium leading-snug tracking-[-0.01em] text-ink">
          {copy.event.dateLine}
        </p>
      </Reveal>

      {/* Schedule — generous vertical rhythm, locked copy only */}
      <Reveal className="mx-auto mt-12 flex max-w-[18rem] flex-col gap-5">
        <p className="font-sans text-[0.95rem] font-medium leading-relaxed tracking-[-0.005em] text-ink">
          {copy.event.akadLine}
        </p>
        <p className="font-sans text-[0.95rem] font-medium leading-relaxed tracking-[-0.005em] text-ink">
          {copy.event.untilLine}
        </p>
      </Reveal>

      {/* Venue line-art — open composition, not packed inside an arch.
          unoptimized: thin line-art + alpha WebP gets crushed/cached-broken by
          the Next image optimizer during hot asset swaps in dev. */}
      <Reveal className="mx-auto mt-14 max-w-[300px]">
        <Image
          src="/assets/illustrations/event-widuri-building.webp"
          alt="Ilustrasi Widuri Restaurant"
          width={1024}
          height={768}
          sizes="(max-width: 480px) 72vw, 300px"
          className="mx-auto h-auto w-full"
          unoptimized
        />
      </Reveal>

      <Reveal className="mt-10">
        <p className="font-serif text-[1.65rem] font-medium leading-tight tracking-[-0.02em] text-ink">
          {copy.event.venueName}
        </p>
        <p className="type-label mt-3 text-dusty-deep">{copy.event.venueFloor}</p>
      </Reveal>

      <Reveal className="mx-auto mt-6 max-w-[18rem]">
        <p className="font-sans text-[0.8rem] font-medium leading-[1.7] tracking-[0.01em] text-muted">
          {copy.event.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </Reveal>

      <Reveal className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Cta href={siteConfig.event.mapsUrl} variant="solid">
          {copy.event.ctaMap}
        </Cta>
        <Cta href={calendarUrl()}>{copy.event.ctaCalendar}</Cta>
      </Reveal>

      {/* Hand-drawn area map — same unoptimized rationale as the building. */}
      <Reveal className="mx-auto mt-14 max-w-[320px]">
        <Image
          src="/assets/illustrations/event-widuri-map-v7.webp"
          alt="Peta sekitar Widuri Restaurant"
          width={1024}
          height={1024}
          sizes="(max-width: 480px) 78vw, 320px"
          className="mx-auto h-auto w-full"
          unoptimized
        />
      </Reveal>

      {/* Dress code */}
      <Reveal className="mt-16">
        <h3 className="type-label">{copy.event.dressCodeHeading}</h3>
        <p className="type-lede mx-auto mt-4 max-w-[28ch]">{copy.event.dressCodeLine}</p>
      </Reveal>

      {/* Notes */}
      <Reveal className="mx-auto mt-14 max-w-sm rounded-3xl border border-border bg-surface/70 px-7 py-8 text-left shadow-petal">
        <h3 className="type-label text-center">{copy.event.notesHeading}</h3>
        <ul className="mt-6 flex flex-col gap-4">
          {copy.event.notes.map((note) => (
            <li key={note} className="type-body flex gap-3 text-left">
              <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-dusty" />
              {note}
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Livestream */}
      <Reveal className="mt-14">
        <h3 className="type-label">{copy.event.livestreamHeading}</h3>
        <p className="type-lede mx-auto mt-4 max-w-[32ch]">{copy.event.livestreamLine}</p>
        {livestream.length > 0 ? (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {livestream.map(([key, url]) => (
              <Cta key={key} href={url}>
                {copy.event.livestreamLabels[key as keyof typeof copy.event.livestreamLabels]}
              </Cta>
            ))}
          </div>
        ) : (
          <p className="mt-5 font-sans text-sm text-muted">
            Tautan livestream menyusul.
          </p>
        )}
      </Reveal>
    </section>
  );
};
