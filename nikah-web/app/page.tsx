import { Invitation } from "@/components/Invitation";
import { PUBLIC_GUEST } from "@/lib/invitation";

/**
 * Home — the bare domain, which is the link that gets forwarded, pasted into
 * bios, and screenshotted. It renders the online invitation with a generic
 * greeting: complete and warm, but carrying no venue address, so nobody can
 * arrive in Bandung from a link that was never meant for them.
 *
 * Personally invited guests always reach `/undangan/<slug>` instead.
 */
export default function HomePage() {
  return <Invitation guest={PUBLIC_GUEST} />;
}
