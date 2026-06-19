/**
 * Single-page orchestration.
 * Order per docs/spec/12 §3: Loading → Gate → Hero → Welcome → Countdown →
 * Story → Japan → Gallery → Event → RSVP → Wishes → Gift → Closing.
 *
 * Heavy sections (Wishes, Gift, Closing) are code-split with next/dynamic
 * (SPEC 11 §5) to keep the initial bundle small. Gallery is loaded eagerly
 * because it owns heavy image assets that benefit from early decode.
 */

import dynamic from "next/dynamic";
import Loading from "@/components/sections/Loading";
import Gate from "@/components/sections/Gate";
import Hero from "@/components/sections/Hero";
import Welcome from "@/components/sections/Welcome";
import Countdown from "@/components/sections/Countdown";
import Story from "@/components/sections/Story";
import Japan from "@/components/sections/Japan";
import Gallery from "@/components/sections/Gallery";
import Event from "@/components/sections/Event";
import Rsvp from "@/components/sections/Rsvp";
import Divider from "@/components/ui/Divider";
import AudioToggle from "@/components/ui/AudioToggle";
import StickyRsvp from "@/components/ui/StickyRsvp";
import ScrollTop from "@/components/ui/ScrollTop";
import MotionPreview from "@/components/motion/MotionPreview";

const Wishes = dynamic(
  () => import("@/components/sections/Wishes").then((m) => m.default),
);
const Gift = dynamic(
  () => import("@/components/sections/Gift").then((m) => m.default),
);
const Closing = dynamic(
  () => import("@/components/sections/Closing").then((m) => m.default),
);

export default function Home() {
  return (
    <main id="top" className="relative">
      <Loading />
      <Gate />
      <Hero />

      <Welcome />
      <Divider />
      <Countdown />
      <Divider />
      <Story />
      <Divider />
      <Japan />
      <Divider />
      <Gallery />
      <Divider />
      <Event />
      <Divider />
      <Rsvp />
      <Divider />
      <Wishes />
      <Divider />
      <Gift />
      <Divider />
      <Closing />

      <MotionPreview />

      <AudioToggle />
      <StickyRsvp />
      <ScrollTop />
    </main>
  );
}
