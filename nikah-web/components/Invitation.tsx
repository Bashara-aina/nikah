"use client";

/**
 * Invitation — the experience orchestrator.
 *
 * Phase machine (plan 03 §7, envelope collapsed into gate — see DELTA.md):
 *   loading → gate → open
 *
 * - Loading holds a short calm beat while gate art paints.
 * - Gate is the single ritual unlock (audio + gyro inside the tap).
 * - Sections mount on open, so the scroll world begins exactly when the
 *   guest steps through the gate. A same-session refresh skips the ritual.
 *
 * Desktop: the experience lives in a centered 480px paper column on a cream
 * field with quiet floral corners — phones get the full-bleed storybook.
 */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "motion/react";
import { GuestProvider } from "@/components/GuestProvider";
import { useSiteAudio } from "@/components/AudioProvider";
import { Loading } from "@/components/sections/Loading";
import { Gate } from "@/components/sections/Gate";
import { Hero } from "@/components/hero/Hero";
import { Welcome } from "@/components/sections/Welcome";
import { Countdown } from "@/components/sections/Countdown";
import { Story } from "@/components/sections/Story";
import { Japan } from "@/components/sections/Japan";
import { EventDetails } from "@/components/sections/EventDetails";
import { Watch } from "@/components/sections/Watch";
import { Rsvp } from "@/components/sections/Rsvp";
import { Wishes } from "@/components/sections/Wishes";
import { GiftFaq } from "@/components/sections/GiftFaq";
import { Closing } from "@/components/sections/Closing";
import { DraperyDivider } from "@/components/ui/DraperyDivider";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { StickyRsvp } from "@/components/ui/StickyRsvp";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import type { InvitationGuest } from "@/lib/invitation";

type Phase = "loading" | "gate" | "open";

export const Invitation = ({ guest }: { guest: InvitationGuest }) => {
  const [phase, setPhase] = useState<Phase>("loading");
  const { unlock } = useSiteAudio();
  const unlockRef = useRef(unlock);

  // Keep the ref in sync outside render (react-hooks/refs) so AudioProvider
  // identity churn cannot reset the phase timer below.
  useEffect(() => {
    unlockRef.current = unlock;
  }, [unlock]);

  useEffect(() => {
    let opened = false;
    try {
      opened = window.sessionStorage.getItem("nikah:opened") === "1";
    } catch {
      /* storage unavailable */
    }
    // Same-session refresh skips the ritual; first visit holds the loading beat.
    // On restore, unlock() keeps the music toggle available (autoplay may be
    // blocked without a gesture — the toggle then resumes playback).
    // unlock is read via ref so AudioProvider identity churn cannot reset the timer.
    const id = window.setTimeout(() => {
      if (opened) {
        unlockRef.current();
        setPhase("open");
      } else {
        setPhase("gate");
      }
    }, opened ? 0 : 1600);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <GuestProvider guest={guest}>
      <div className="min-h-[100svh] bg-cream">
        {/* Desktop-only quiet field decorations outside the paper column. */}
        <div aria-hidden className="pointer-events-none fixed inset-0 hidden min-[560px]:block">
          <Image
            src="/assets/florals/floral-corner-tl.webp"
            alt=""
            width={446}
            height={559}
            sizes="176px"
            className="absolute left-0 top-0 w-44 opacity-50"
          />
          <Image
            src="/assets/florals/floral-corner-br.webp"
            alt=""
            width={247}
            height={353}
            sizes="160px"
            className="absolute bottom-0 right-0 w-40 opacity-50"
          />
        </div>

        <AnimatePresence mode="wait">
          {phase === "loading" ? <Loading key="loading" /> : null}
          {phase === "gate" ? <Gate key="gate" onOpen={() => setPhase("open")} /> : null}
        </AnimatePresence>

        {phase === "open" ? (
          <main className="relative mx-auto w-full max-w-[480px] bg-paper shadow-float">
            <ScrollProgress />
            <Hero />
            <Welcome />
            <Countdown />
            <Story />
            <DraperyDivider />
            <Japan />
            {/* The only structural fork between the two invitations: venue
                guests get address, map, dress code and notes; online guests get
                the livestream channels in the same slot. */}
            {guest.inviteType === "venue" ? <EventDetails /> : <Watch />}
            <DraperyDivider />
            <Rsvp />
            <Wishes />
            <GiftFaq />
            <Closing />
            <MusicToggle />
            <StickyRsvp />
          </main>
        ) : null}
      </div>
    </GuestProvider>
  );
};
