import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import {
  dashboardConfigured,
  hasDashboardSession,
  issueSession,
  passphraseMatches,
  verifySession,
} from "./auth";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

const ORIGINAL = process.env.DASHBOARD_PASSPHRASE;

beforeEach(() => {
  process.env.DASHBOARD_PASSPHRASE = "maple orbit velvet river";
});

afterEach(() => {
  vi.useRealTimers();
  if (ORIGINAL === undefined) delete process.env.DASHBOARD_PASSPHRASE;
  else process.env.DASHBOARD_PASSPHRASE = ORIGINAL;
});

describe("passphraseMatches", () => {
  it("accepts only the exact configured value", () => {
    expect(passphraseMatches("maple orbit velvet river")).toBe(true);
    expect(passphraseMatches("maple orbit velvet")).toBe(false);
    expect(passphraseMatches("maple orbit velvet river extra")).toBe(false);
    expect(passphraseMatches("different length")).toBe(false);
    expect(passphraseMatches("")).toBe(false);
  });

  it("reports whether auth is configured", () => {
    expect(dashboardConfigured()).toBe(true);
    delete process.env.DASHBOARD_PASSPHRASE;
    expect(dashboardConfigured()).toBe(false);
  });

  it("rejects everything when unconfigured", () => {
    delete process.env.DASHBOARD_PASSPHRASE;
    expect(passphraseMatches("maple orbit velvet river")).toBe(false);
  });
});

describe("sessions", () => {
  it("issues and verifies a session", () => {
    expect(verifySession(issueSession().value)).toBe(true);
  });

  it("rejects missing, malformed, and tampered sessions", () => {
    const token = issueSession().value;
    const [expiry, signature] = token.split(".") as [string, string];
    expect(verifySession(undefined)).toBe(false);
    expect(verifySession("bad")).toBe(false);
    expect(verifySession(`.${signature}`)).toBe(false);
    expect(verifySession(`${expiry}.`)).toBe(false);
    expect(verifySession(`${expiry}.${signature}.extra`)).toBe(false);
    expect(verifySession(`${Number(expiry) + 1}.${signature}`)).toBe(false);
    expect(verifySession(`${expiry}.${signature.slice(1)}`)).toBe(false);
  });

  it("rejects a signed non-numeric expiry", () => {
    const expiry = "not-a-number";
    const signature = createHmac("sha256", process.env.DASHBOARD_PASSPHRASE ?? "")
      .update(expiry)
      .digest("base64url");
    expect(verifySession(`${expiry}.${signature}`)).toBe(false);
  });

  it("rejects expired sessions", () => {
    vi.useFakeTimers();
    const token = issueSession().value;
    vi.advanceTimersByTime(31 * 24 * 60 * 60 * 1000);
    expect(verifySession(token)).toBe(false);
  });

  it("rejects a token after the secret changes", () => {
    const token = issueSession().value;
    process.env.DASHBOARD_PASSPHRASE = "another secret entirely";
    expect(verifySession(token)).toBe(false);
  });

  it("reads a valid session from the request cookie", async () => {
    const token = issueSession().value;
    vi.mocked(cookies).mockResolvedValue({ get: () => ({ value: token }) } as never);
    expect(await hasDashboardSession()).toBe(true);
    vi.mocked(cookies).mockResolvedValue({ get: () => undefined } as never);
    expect(await hasDashboardSession()).toBe(false);
  });

  it("rejects sessions when unconfigured", () => {
    const token = issueSession().value;
    delete process.env.DASHBOARD_PASSPHRASE;
    expect(verifySession(token)).toBe(false);
  });
});
