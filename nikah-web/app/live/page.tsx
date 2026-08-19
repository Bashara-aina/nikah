import type { Metadata } from "next";
import Image from "next/image";
import { Cta } from "@/components/ui/Cta";
import { calendarUrl, siteConfig } from "@/lib/config";
import { copy } from "@/lib/copy";

/**
 * The stable livestream page.
 *
 * WhatsApp messages point here rather than at YouTube directly, so already-sent
 * messages never go stale. Filling `siteConfig.livestream` updates every
 * invitation at once.
 *
 * Deliberately a plain server component: no gate, no audio, no scroll story —
 * someone opening this at 09.55 on the day wants the link, immediately.
 */
export const metadata: Metadata = {
  title: copy.watch.heading,
};

type Channel = keyof typeof siteConfig.livestream;
const CHANNELS = Object.keys(siteConfig.livestream) as Channel[];

export default function LivePage() {
  const live = siteConfig.livestream;
  const anyLive = CHANNELS.some((key) => live[key] !== "");

  return (
    <main className="mx-auto flex min-h-[100svh] w-full max-w-[480px] flex-col items-center bg-paper px-8 py-16 text-center shadow-float">
      {/* Monogram, same treatment as the gate — the wreath alone is too pale to
          read as anything, so it carries the letters. */}
      <div className="relative">
        <Image
          src="/assets/illustrations/gate-monogram-frame.webp"
          alt=""
          width={1000}
          height={1000}
          loading="eager"
          sizes="150px"
          className="h-auto w-[150px] [mask-image:radial-gradient(circle,black_62%,transparent_78%)]"
        />
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center font-serif text-2xl font-medium tracking-widest text-ink"
        >
          H&thinsp;&amp;&thinsp;B
        </span>
      </div>

      <h1 className="type-display mt-4">{siteConfig.couple.short}</h1>
      <div aria-hidden className="my-5 h-px w-20 bg-gold/70" />

      <h2 className="type-display-sm">{copy.watch.heading}</h2>
      <p className="type-lede mx-auto mt-4 max-w-sm">{copy.watch.lead}</p>

      <div className="mt-10 flex flex-col gap-2">
        <p className="type-prose text-ink">
          {copy.watch.dayLine}, {copy.watch.dateLine}
        </p>
        <p className="type-body text-ink">{copy.watch.timeLine}</p>
        <p className="type-meta">{copy.watch.timezoneNote}</p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {CHANNELS.map((key) => (
          <Cta key={key} href={live[key] || undefined} pending={live[key] === ""}>
            {copy.event.livestreamLabels[key]}
          </Cta>
        ))}
      </div>

      {!anyLive ? <p className="type-meta mx-auto mt-6 max-w-xs">{copy.watch.pending}</p> : null}

      <div className="mt-10">
        <Cta href={calendarUrl({ online: true })} variant="solid">
          {copy.watch.ctaCalendar}
        </Cta>
      </div>

      <p className="type-lede mt-16 text-dusty-deep">{copy.closing.hashtag}</p>
    </main>
  );
}
