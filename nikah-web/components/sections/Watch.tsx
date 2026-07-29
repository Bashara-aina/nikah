"use client";

/**
 * Cara Menyaksikan — the online invitation's counterpart to EventDetails.
 *
 * It occupies the same slot and the same visual weight as the venue section:
 * the floral arch carries the date the way the Widuri building does there, and
 * the channel row fills the space the map and dress code leave behind. Nothing
 * here references the venue, so the page never reads as a trimmed-down copy of
 * another invitation.
 *
 * Channels with no URL yet render as inert pills rather than disappearing —
 * the row keeps its shape when the couple fills the links in later.
 */
import Image from "next/image";
import { Reveal } from "@/components/primitives/Reveal";
import { Cta } from "@/components/ui/Cta";
import { calendarUrl, siteConfig } from "@/lib/config";
import { copy } from "@/lib/copy";

type Channel = keyof typeof siteConfig.livestream;

const CHANNELS = Object.keys(siteConfig.livestream) as Channel[];

export const Watch = () => {
  const live = siteConfig.livestream;
  const anyLive = CHANNELS.some((key) => live[key] !== "");

  return (
    <section
      id="event"
      aria-label={copy.a11y.watch}
      data-cv="auto"
      className="bg-paper px-8 pb-24 pt-16 text-center"
    >
      <Reveal>
        <h2 className="type-display">{copy.watch.heading}</h2>
        <div aria-hidden className="mx-auto mt-4 h-px w-20 bg-gold/70" />
        <p className="type-lede mx-auto mt-6 max-w-sm">{copy.watch.lead}</p>
      </Reveal>

      {/* Floral arch holding the date — the online invitation's centrepiece.
          Inset percentages match the artwork's clear interior. */}
      <Reveal className="relative mx-auto mt-12 max-w-[300px]">
        <Image
          src="/assets/illustrations/event-arch-frame.webp"
          alt=""
          width={423}
          height={559}
          sizes="(max-width: 480px) 72vw, 300px"
          className="h-auto w-full"
        />
        {/* Sits where the arch is widest; the weekday and date are separate
            lines by design rather than a wrap. */}
        <div className="absolute inset-x-[18%] top-[22%] flex flex-col items-center gap-1 rounded-2xl bg-paper/90 px-2 py-2 shadow-petal">
          <p className="type-prose text-ink">{copy.watch.dayLine}</p>
          <p className="type-prose mb-2 text-ink">{copy.watch.dateLine}</p>
          <div aria-hidden className="h-px w-12 bg-gold/70" />
          <p className="type-body text-ink">{copy.watch.timeLine}</p>
          <p className="type-meta">{copy.watch.timezoneNote}</p>
        </div>
      </Reveal>

      <Reveal className="mt-12 flex flex-wrap justify-center gap-3">
        {CHANNELS.map((key) => (
          <Cta key={key} href={live[key] || undefined} pending={live[key] === ""}>
            {copy.event.livestreamLabels[key]}
          </Cta>
        ))}
      </Reveal>

      {!anyLive ? (
        <Reveal className="mt-6">
          <p className="type-meta mx-auto max-w-xs">{copy.watch.pending}</p>
        </Reveal>
      ) : null}

      <Reveal className="mt-10">
        <Cta href={calendarUrl({ online: true })} variant="solid">
          {copy.watch.ctaCalendar}
        </Cta>
      </Reveal>
    </section>
  );
};
