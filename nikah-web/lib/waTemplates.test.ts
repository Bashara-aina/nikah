import { describe, expect, it } from "vitest";
import type { GuestGroup, InviteType } from "./db.types";
import { renderMessage, templateFor, waTemplates } from "./waTemplates";

const groups: GuestGroup[] = ["groom_family", "bride_family", "friend"];
const types: InviteType[] = ["venue", "online"];

const guest = (guest_group: GuestGroup, invite_type: InviteType) => ({
  slug: `${invite_type}-${guest_group}`,
  display_name: "Bapak Achmad",
  whatsapp_name: "Om Achmad",
  guest_group,
  invite_type,
  message_override: null,
});

describe("waTemplates", () => {
  it("contains all six complete templates", () => {
    for (const inviteType of types) {
      for (const guestGroup of groups) {
        const template = templateFor({ guest_group: guestGroup, invite_type: inviteType });
        expect(template.length).toBeGreaterThan(0);
        expect(template).toContain("{nama}");
        expect(template).toContain("{link}");
        expect(renderMessage(guest(guestGroup, inviteType))).not.toContain("{");
      }
    }
    expect(Object.keys(waTemplates)).toHaveLength(6);
  });

  it("prefers the WhatsApp name and falls back to the display name", () => {
    expect(renderMessage(guest("friend", "venue"))).toContain("Om Achmad");
    expect(
      renderMessage({ ...guest("friend", "venue"), whatsapp_name: "  " }),
    ).toContain("Bapak Achmad");
  });

  it("resolves placeholders inside an override", () => {
    const message = renderMessage({
      ...guest("friend", "online"),
      message_override: "Halo {nama}. {tanggal}: {link}",
    });
    expect(message).toContain("Halo Om Achmad.");
    expect(message).toContain("22 Agustus 2026");
    expect(message).toContain("/undangan/online-friend");
    expect(message).not.toContain("{");
  });

  it("keeps online templates free of venue and exclusion language", () => {
    const forbidden = /bandung|widuri|ciliwung|alamat|dress code|terbatas/i;
    for (const group of groups) {
      expect(templateFor({ guest_group: group, invite_type: "online" })).not.toMatch(forbidden);
    }
  });
});
