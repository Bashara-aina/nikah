import { Gate } from "@/components/sections/Gate";
import { Hero } from "@/components/hero/Hero";
import { Particles } from "@/components/motion/Particles";
import { siteConfig } from "@/lib/config";

/**
 * Home page — Loading → Gate → Hero → …section stubs.
 *
 * The Gate owns the first paint. When the guest taps "Buka Undangan", the
 * Gate exits via `AnimatePresence` and Hero assembles. Particles float
 * above the entire viewport; section stubs below the Hero are placeholders
 * so the route map is buildable while Phase 0 + per-section PRs land.
 */
export default function HomePage() {
  return (
    <main className="relative">
      <Particles />
      <Gate />
      <Hero />

      {/* Section stubs — to be implemented per docs/10. */}
      <section
        id="welcome"
        aria-label="Sambutan"
        className="min-h-[60vh] bg-paper px-6 py-24 text-center"
      >
        <p className="font-serif text-base italic text-ink/60">Welcome — coming soon</p>
      </section>
      <section
        id="countdown"
        aria-label="Hitung mundur"
        className="min-h-[40vh] bg-cream px-6 py-20 text-center"
      >
        <p className="font-serif text-base italic text-ink/60">Countdown — coming soon</p>
      </section>
      <section
        id="story"
        aria-label="Kisah kami"
        className="min-h-[60vh] bg-paper px-6 py-24 text-center"
      >
        <p className="font-serif text-base italic text-ink/60">Story — coming soon</p>
      </section>
      <section
        id="event"
        aria-label="Acara"
        className="min-h-[60vh] bg-cream px-6 py-24 text-center"
      >
        <p className="font-serif text-base italic text-ink/60">Event — coming soon</p>
      </section>
      <section
        id="rsvp"
        aria-label="Konfirmasi kehadiran"
        className="min-h-[40vh] bg-paper px-6 py-20 text-center"
      >
        <p className="font-serif text-base italic text-ink/60">RSVP — coming soon</p>
      </section>
      <section
        id="wishes"
        aria-label="Ucapan"
        className="min-h-[40vh] bg-cream px-6 py-20 text-center"
      >
        <p className="font-serif text-base italic text-ink/60">Wishes — coming soon</p>
      </section>
      <section
        id="gift"
        aria-label="Hadiah"
        className="min-h-[40vh] bg-paper px-6 py-20 text-center"
      >
        <p className="font-serif text-base italic text-ink/60">Gift — coming soon</p>
      </section>
      <section
        id="closing"
        aria-label="Penutup"
        className="min-h-[50vh] bg-cream px-6 py-24 text-center"
      >
        <p className="font-serif text-base italic text-ink/60">
          {siteConfig.couple.hashtag}
        </p>
      </section>

      {/* Audio — preloaded, only played after the Gate tap. */}
      <audio
        className="site-audio hidden"
        src={siteConfig.audio.src}
        preload="none"
        loop
      />
    </main>
  );
}