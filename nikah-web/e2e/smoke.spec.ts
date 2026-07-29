import { expect, test } from "@playwright/test";

test("public invitation reaches the gate", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Buka Undangan" })).toBeVisible();
});

test("live page keeps all four channels visible", async ({ page }) => {
  await page.goto("/live");
  await expect(page.getByRole("button", { name: "YouTube" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Zoom" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Instagram" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Facebook" })).toBeDisabled();
});

test("dashboard rejects a wrong passphrase and accepts the configured one", async ({ page }) => {
  const passphrase = process.env.DASHBOARD_PASSPHRASE ?? "roadmap smoke passphrase";
  await page.goto("/dashboard");
  const input = page.getByLabel("Kata sandi");
  await input.fill("wrong passphrase");
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page.getByText("Kata sandi salah")).toBeVisible();
  await input.fill(passphrase);
  await page.getByRole("button", { name: "Masuk" }).click();
  // Configured DB → guest manager. Unwired env → notice. Both prove auth worked.
  await expect(
    page
      .getByRole("button", { name: "Tambah tamu" })
      .or(page.getByRole("heading", { name: "Belum tersambung" }))
      .or(page.getByRole("heading", { name: "Database belum siap" })),
  ).toBeVisible();
});
