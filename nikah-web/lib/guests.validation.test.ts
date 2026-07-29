import { describe, expect, it } from "vitest";
import { GuestError, validateGuestInput } from "./guestValidation";

const valid = {
  display_name: "Bapak Achmad",
  slug: "bapak-achmad",
  whatsapp_name: "Om Achmad",
  phone: "0812-3456-7890",
  guest_group: "groom_family",
  invite_type: "venue",
  party_label: "Beserta Keluarga",
  party_max: 4,
  message_override: "Halo {nama}",
  notes: "Saudara",
  alternative_channel: "Instagram @achmad",
  reminder_note: "Ingatkan 12 Agustus",
};

const expectInvalid = (input: unknown) => {
  expect(() => validateGuestInput(input)).toThrow(GuestError);
};

describe("validateGuestInput", () => {
  it("rejects unreadable data", () => {
    expectInvalid(null);
    expectInvalid("bad");
  });

  it("rejects missing and invalid required fields", () => {
    expectInvalid({ ...valid, display_name: " " });
    expectInvalid({ ...valid, slug: "Bad Slug" });
    expectInvalid({ ...valid, guest_group: "other" });
    expectInvalid({ ...valid, invite_type: "other" });
    expectInvalid({ ...valid, phone: "abc" });
  });

  it("derives and normalizes fields", () => {
    const result = validateGuestInput({ ...valid, display_name: "Tante Élodie", slug: "" });
    expect(result.slug).toBe("tante-elodie");
    expect(result.phone).toBe("6281234567890");
  });

  it("clamps party size and defaults invalid numbers", () => {
    expect(validateGuestInput({ ...valid, party_max: 0 }).party_max).toBe(1);
    expect(validateGuestInput({ ...valid, party_max: 20 }).party_max).toBe(10);
    expect(validateGuestInput({ ...valid, party_max: 2.5 }).party_max).toBe(2);
    expect(validateGuestInput({ ...valid, party_max: "bad" }).party_max).toBe(2);
  });

  it("strips tags, controls, and excess length", () => {
    const result = validateGuestInput({
      ...valid,
      display_name: "<b>Bapak\u0000 Achmad</b>",
      notes: `${"a".repeat(600)}<script>bad</script>`,
    });
    expect(result.display_name).toBe("Bapak  Achmad");
    expect(result.notes).toHaveLength(500);
    expect(result.notes).not.toContain("<");
  });

  it("handles non-string optional fields", () => {
    const result = validateGuestInput({
      ...valid,
      whatsapp_name: null,
      party_label: undefined,
      message_override: null,
      notes: undefined,
      alternative_channel: null,
      reminder_note: undefined,
    });
    expect(result.whatsapp_name).toBeNull();
    expect(result.party_label).toBe("");
    expect(result.message_override).toBeNull();
    expect(result.notes).toBeNull();
  });

  it("returns null for empty optional fields", () => {
    const result = validateGuestInput({
      ...valid,
      whatsapp_name: "",
      phone: "",
      message_override: "",
      notes: "",
      alternative_channel: "",
      reminder_note: "",
    });
    expect(result.whatsapp_name).toBeNull();
    expect(result.phone).toBeNull();
    expect(result.message_override).toBeNull();
    expect(result.notes).toBeNull();
    expect(result.alternative_channel).toBeNull();
    expect(result.reminder_note).toBeNull();
  });
});
