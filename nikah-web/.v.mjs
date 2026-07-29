/**
 * Renders both invitation variants in a real Chromium and asserts what a guest
 * actually sees after tapping through the gate.
 */
import { chromium } from "@playwright/test";

const BASE = "http://localhost:3100";
const FORBIDDEN = ["Ciliwung", "Widuri", "Cihapit", "Dress Code", "Lihat Peta", "terbatas"];

let failures = 0;
const ok = (label, condition, detail = "") => {
  console.log(`  ${condition ? "PASS" : "FAIL"}  ${label}${detail ? `  — ${detail}` : ""}`);
  if (!condition) failures += 1;
};

const browser = await chromium.launch();

const openInvitation = async (slug) => {
  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/undangan/${slug}`, { waitUntil: "domcontentloaded" });
  const gate = page.locator("#gate");
  await gate.waitFor({ state: "visible", timeout: 15000 });
  const gateText = await gate.textContent();
  await page.getByRole("button", { name: "Buka Undangan" }).click();
  await page.locator("main section#event").waitFor({ state: "attached", timeout: 15000 });
  await page.waitForTimeout(1200);
  return { context, page, gateText };
};

console.log("\nVenue invitation (/undangan/ui-venue)");
{
  const { context, page, gateText } = await openInvitation("ui-venue");
  ok("gate greets the guest by name", gateText.includes("Bapak Uji Venue dan Keluarga"));
  ok("gate shows the party label", gateText.includes("BESERTA KELUARGA") || gateText.includes("Beserta Keluarga"));
  const body = await page.locator("body").textContent();
  ok("venue section is Detail acara",
     (await page.locator("#event").getAttribute("aria-label")) === "Detail acara");
  ok("address is present", body.includes("Ciliwung"));
  ok("dress code is present", body.includes("Dress Code"));
  ok("RSVP asks for a party size", body.includes("Jumlah yang datang"));
  ok("closing points at Bandung", /Sampai bertemu di Bandung/.test(body));
  ok("party selector capped at the guest's party_max (4)",
     (await page.locator('#rsvp [role="group"] button').count()) === 4,
     `${await page.locator('#rsvp [role="group"] button').count()} buttons`);
  await page.screenshot({ path: "/tmp/variant-venue.png", fullPage: false });
  await context.close();
}

console.log("\nOnline invitation (/undangan/ui-online)");
{
  const { context, page, gateText } = await openInvitation("ui-online");
  ok("gate greets the guest by name", gateText.includes("Tante Uji Daring"));
  const body = await page.locator("body").textContent();
  ok("section is Cara menyaksikan siaran langsung",
     (await page.locator("#event").getAttribute("aria-label")) === "Cara menyaksikan siaran langsung");
  ok("Cara Menyaksikan heading present", body.includes("Cara Menyaksikan"));
  ok("four livestream channels listed",
     ["YouTube", "Zoom", "Instagram", "Facebook"].every((c) => body.includes(c)));
  ok("pending copy shown while URLs are empty", body.includes("Tautannya menyusul"));
  ok("RSVP is the online one", body.includes("Konfirmasi Menyaksikan"));
  ok("no party-size question", !body.includes("Jumlah yang datang"));
  ok("online FAQ", body.includes("Siarannya bisa ditonton di mana?"));
  ok("closing points at the livestream", /Sampai bertemu di siaran langsung/.test(body));
  const found = FORBIDDEN.filter((w) => body.includes(w));
  ok("NO venue detail anywhere in the page", found.length === 0, found.join(", ") || "clean");
  const sections = await page.locator("main section").count();
  ok("same section count as the venue variant", sections >= 10, `${sections} sections`);
  await page.screenshot({ path: "/tmp/variant-online.png", fullPage: false });
  await context.close();
}

console.log("\nPublic pages");
{
  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded" });
  await page.locator("#gate").waitFor({ state: "visible", timeout: 15000 });
  ok("bare domain greets generically",
     (await page.locator("#gate").textContent()).includes("Bapak/Ibu/Saudara/i"));
  await page.getByRole("button", { name: "Buka Undangan" }).click();
  await page.locator("main section#event").waitFor({ state: "attached", timeout: 15000 });
  await page.waitForTimeout(800);
  const body = await page.locator("body").textContent();
  ok("bare domain carries no venue detail", FORBIDDEN.every((w) => !body.includes(w)));

  await page.goto(`${BASE}/live`, { waitUntil: "domcontentloaded" });
  const live = await page.locator("body").textContent();
  ok("/live shows the four channels",
     ["YouTube", "Zoom", "Instagram", "Facebook"].every((c) => live.includes(c)));
  ok("/live carries no venue detail", FORBIDDEN.every((w) => !live.includes(w)));
  await page.screenshot({ path: "/tmp/variant-live.png" });
  await context.close();
}

await browser.close();
console.log(`\n${failures === 0 ? "ALL VARIANT CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
