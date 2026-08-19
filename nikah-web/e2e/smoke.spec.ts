import { expect, test } from "@playwright/test";

test("public invitation reaches the gate", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Info Acara Kami" })).toBeVisible();
});

test("live page points at the YouTube stream only", async ({ page }) => {
  await page.goto("/live");
  const youtube = page.getByRole("link", { name: "YouTube" });
  await expect(youtube).toBeVisible();
  await expect(youtube).toHaveAttribute("href", "https://youtube.com/live/ki6U9TZ3ovE");
  await expect(page.getByRole("link", { name: "Zoom" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Instagram" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Facebook" })).toHaveCount(0);
});
