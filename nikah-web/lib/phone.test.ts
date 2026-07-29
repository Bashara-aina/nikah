import { describe, expect, it } from "vitest";
import { formatPhone, normalizePhone, whatsappLink } from "./phone";

describe("normalizePhone", () => {
  it.each([
    ["0812-3456-7890", "6281234567890"],
    ["+62 812 3456 7890", "6281234567890"],
    ["62 812 3456 7890", "6281234567890"],
    ["812 3456 7890", "6281234567890"],
    ["+81 90-1234-5678", "819012345678"],
    ["00812345678", "62812345678"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizePhone(input)).toBe(expected);
  });

  it.each(["", "abc", "123", "1234567890123456"])("rejects %s", (input) => {
    expect(normalizePhone(input)).toBeNull();
  });

  it("rejects missing values", () => {
    expect(normalizePhone(null)).toBeNull();
    expect(normalizePhone(undefined)).toBeNull();
    expect(normalizePhone("   ")).toBeNull();
  });

  it("formats normalized values with a plus", () => {
    const normalized = normalizePhone("0812-3456-7890");
    expect(formatPhone(normalized)).toMatch(/^\+/);
    expect(formatPhone(null)).toBe("");
    // Indonesian reading order: country code, then 3-4-4.
    expect(formatPhone("6281234567899")).toBe("+62 812-3456-7899");
    expect(formatPhone("6281234567890")).toBe("+62 812-3456-7890");
    expect(formatPhone("819012345678")).toBe("+81 901-2345-678");
    // Short remainders must not produce trailing separators.
    expect(formatPhone("62812345")).toBe("+62 812-345");
    expect(formatPhone("62812")).toBe("+62 812");
  });
});

describe("whatsappLink", () => {
  it("returns null without a number", () => {
    expect(whatsappLink(null, "hi")).toBeNull();
  });

  it("encodes the complete message", () => {
    expect(whatsappLink("6281234567890", "a b&c")).toBe(
      "https://wa.me/6281234567890?text=a%20b%26c",
    );
  });
});
