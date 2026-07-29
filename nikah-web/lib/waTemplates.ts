/**
 * WhatsApp message templates — six starters, one per (group × invite type).
 *
 * The dashboard resolves a template for each guest, shows the result in an
 * editable box, and saves any edit as that guest's `message_override`.
 *
 * Voice follows `lib/copy.ts`: plain sentences, "kami" throughout, the em dash
 * rationed. The family templates speak in the voice of the person that side
 * knows ("saya Bashara" to his family, "saya Hanifah" to hers).
 *
 * The online templates never mention Bandung, the venue, or a guest list. They
 * are complete invitations to witness the akad live, so nothing in them can
 * read as a downgrade from an invitation the guest was not offered.
 *
 * Placeholders: {nama} {link} {tanggal}
 */
import { siteConfig } from "./config";
import type { GuestGroup, GuestRow, InviteType } from "./db.types";

type TemplateKey = `${InviteType}:${GuestGroup}`;

export const waTemplates: Record<TemplateKey, string> = {
  "venue:groom_family": `Assalamualaikum warahmatullahi wabarakatuh.

Kepada {nama},

Dengan memohon rahmat Allah SWT, saya Bashara bersama Hanifah bermaksud melangsungkan pernikahan kami pada {tanggal} di Bandung.

Merupakan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu. Detail acara, lokasi, dan konfirmasi kehadiran ada di undangan berikut:
{link}

Atas perhatiannya kami ucapkan terima kasih.
Wassalamualaikum warahmatullahi wabarakatuh.

Hanifah & Bashara`,

  "venue:bride_family": `Assalamualaikum warahmatullahi wabarakatuh.

Kepada {nama},

Dengan memohon rahmat Allah SWT, saya Hanifah bersama Bashara bermaksud melangsungkan pernikahan kami pada {tanggal} di Bandung.

Merupakan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu. Detail acara, lokasi, dan konfirmasi kehadiran ada di undangan berikut:
{link}

Atas perhatiannya kami ucapkan terima kasih.
Wassalamualaikum warahmatullahi wabarakatuh.

Hanifah & Bashara`,

  "venue:friend": `Assalamualaikum, {nama}!

Insyaallah kami menikah pada {tanggal} di Bandung. Kami senang sekali kalau kamu bisa datang.

Semua detailnya ada di undangan ini, lengkap dengan lokasi dan konfirmasi kehadiran:
{link}

Ditunggu kabarnya, ya. Terima kasih!

Hanifah & Bashara`,

  "online:groom_family": `Assalamualaikum warahmatullahi wabarakatuh.

Kepada {nama},

Dengan memohon rahmat Allah SWT, saya Bashara bersama Hanifah bermaksud melangsungkan akad pernikahan kami pada {tanggal}.

Acaranya kami siarkan langsung, dan kami mengundang untuk menyaksikan serta mendoakan kami dari mana pun berada. Tautan siaran dan detailnya ada di sini:
{link}

Doa restunya sangat berarti bagi kami.
Wassalamualaikum warahmatullahi wabarakatuh.

Hanifah & Bashara`,

  "online:bride_family": `Assalamualaikum warahmatullahi wabarakatuh.

Kepada {nama},

Dengan memohon rahmat Allah SWT, saya Hanifah bersama Bashara bermaksud melangsungkan akad pernikahan kami pada {tanggal}.

Acaranya kami siarkan langsung, dan kami mengundang untuk menyaksikan serta mendoakan kami dari mana pun berada. Tautan siaran dan detailnya ada di sini:
{link}

Doa restunya sangat berarti bagi kami.
Wassalamualaikum warahmatullahi wabarakatuh.

Hanifah & Bashara`,

  "online:friend": `Assalamualaikum, {nama}!

Insyaallah kami menikah pada {tanggal}. Akadnya kami siarkan langsung, dan kami ingin kamu ikut menyaksikan dari mana pun kamu berada.

Tautan siaran dan cara menontonnya ada di sini:
{link}

Doa dan ucapanmu kami tunggu, ya. Terima kasih!

Hanifah & Bashara`,
};

export const guestLink = (slug: string): string =>
  `${siteConfig.siteUrl.replace(/\/$/, "")}/undangan/${slug}`;

type MessageGuest = Pick<
  GuestRow,
  "slug" | "display_name" | "whatsapp_name" | "guest_group" | "invite_type" | "message_override"
>;

/** Template body for a guest, before placeholders are filled. */
export const templateFor = (guest: Pick<MessageGuest, "guest_group" | "invite_type">): string =>
  waTemplates[`${guest.invite_type}:${guest.guest_group}`];

/**
 * The exact text that goes to WhatsApp: the guest's saved override when they
 * have one, otherwise their group template, with placeholders resolved.
 */
export const renderMessage = (guest: MessageGuest): string =>
  (guest.message_override || templateFor(guest))
    .replaceAll("{nama}", guest.whatsapp_name?.trim() || guest.display_name)
    .replaceAll("{link}", guestLink(guest.slug))
    .replaceAll("{tanggal}", siteConfig.event.dateLabel);
