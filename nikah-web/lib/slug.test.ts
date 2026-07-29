import { describe, expect, it } from "vitest";
import { isValidSlug, slugify } from "./slug";

describe("slugify", () => {
  it.each([
    ["Bapak Achmad Fuad Bay & Keluarga", "bapak-achmad-fuad-bay-keluarga"],
    ["  Tante   Rina  ", "tante-rina"],
    ["Ádé Élodie!", "ade-elodie"],
    ["A...B___C", "a-b-c"],
  ])("converts %s", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("clamps to 60 valid characters", () => {
    const slug = slugify(`${"a".repeat(59)} -- b`);
    expect(slug.length).toBeLessThanOrEqual(60);
    expect(isValidSlug(slug)).toBe(true);
  });

  it.each(["hello world", "Hello", "-hello", "hello-", "hello--world", "", "a".repeat(81)])(
    "rejects %s",
    (slug) => {
      expect(isValidSlug(slug)).toBe(false);
    },
  );

  it.each(["Nama", "Bapak Ahmad 2", "Élodie", "A & B", "123"])(
    "always creates a valid non-empty slug from %s",
    (input) => {
      expect(isValidSlug(slugify(input))).toBe(true);
    },
  );
});
