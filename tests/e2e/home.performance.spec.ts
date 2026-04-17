import { expect, test } from "@playwright/test";

test("homepage stays lean and interactive", async ({ page }, testInfo) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /wedding tracks/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /schedule a private tour/i })).toBeVisible();
  await page.waitForLoadState("networkidle");

  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");
    const videoEntries = resources.filter((entry) => entry.name.includes(".mp4"));
    const nextImageEntries = resources.filter((entry) => entry.name.includes("/_next/image"));

    return {
      heroVideoCount: document.querySelectorAll("video[data-hero-video]").length,
      heroVideoRequests: videoEntries.length,
      totalTransferSize: Math.round(
        resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0),
      ),
      hasOptimizedImages: nextImageEntries.length > 0,
    };
  });

  expect(consoleErrors, consoleErrors.join("\n")).toEqual([]);
  expect(metrics.heroVideoCount).toBe(1);
  expect(metrics.heroVideoRequests).toBeLessThanOrEqual(1);
  expect(metrics.totalTransferSize).toBeLessThan(
    testInfo.project.name.includes("mobile") ? 1_600_000 : 1_700_000,
  );
});

test("content pages use optimized images", async ({ page }) => {
  for (const path of ["/about", "/packages", "/things-to-do"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const optimizedImageCount = await page.locator('img[src*="/_next/image"]').count();
    expect(optimizedImageCount, `${path} should serve optimized images`).toBeGreaterThan(0);
  }
});

test("mobile sticky nav appears after scrolling the hero", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only behavior.");

  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, window.innerWidth));

  await expect(page.getByRole("navigation").filter({ hasText: /schedule/i }).first()).toBeVisible();
});
