import { headers } from "next/headers";
import { after } from "next/server";
import { Invitation } from "@/components/Invitation";
import { getGuestBySlug, trackOpen } from "@/lib/guests";
import { supabaseConfigured } from "@/lib/supabaseAdmin";
import { PUBLIC_GUEST, toInvitationGuest } from "@/lib/invitation";

/**
 * The personalised invitation.
 *
 * The slug is the only thing in the URL — the invite type is resolved here,
 * server-side, so editing the address cannot turn a livestream invitation into
 * a venue one.
 *
 * An unknown slug is not a 404. Mistyped and truncated links are common in
 * WhatsApp, and a wedding invitation that says "not found" is worse than one
 * that greets the reader generically, so the public online invitation is the
 * fallback for anything that does not resolve.
 */
export const dynamic = "force-dynamic";

const CRAWLER =
  /whatsapp|facebookexternalhit|twitterbot|telegrambot|slackbot|discordbot|bot|crawler|preview/i;

export default async function GuestInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!supabaseConfigured()) return <Invitation guest={PUBLIC_GUEST} />;

  let guest = PUBLIC_GUEST;
  try {
    const row = await getGuestBySlug(slug);
    if (row) {
      guest = toInvitationGuest(row);
      const userAgent = (await headers()).get("user-agent") ?? "";
      if (!CRAWLER.test(userAgent)) after(() => trackOpen(slug));
    }
  } catch (error) {
    // A database hiccup must not hand a guest an error page; log it and serve
    // the generic invitation instead.
    console.error(`Guest lookup failed for "${slug}":`, error);
  }

  return <Invitation guest={guest} />;
}
