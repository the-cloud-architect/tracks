import { expect, test } from "@playwright/test";

test("FAQ explains catering, site-manager support, and ATV use", async ({ page }) => {
  await page.goto("/faq");

  await expect(
    page.getByRole("heading", { name: "What restaurant and catering options are available?" }),
  ).toBeVisible();
  await expect(page.getByText("Restaurant pickup:")).toBeVisible();
  await expect(page.getByText("Restaurant drop-off:")).toBeVisible();
  await expect(page.getByText("Full-service catering:")).toBeVisible();

  await expect(
    page.getByRole("heading", {
      name: "When will the site manager arrive, and what will they help with?",
    }),
  ).toBeVisible();
  await expect(page.getByText(/Connect your favorite playlist/)).toBeVisible();
  await expect(page.getByText(/Keep shared areas tidy/)).toBeVisible();

  await expect(page.getByRole("heading", { name: "How do the ATVs work?" })).toBeVisible();
  await expect(page.getByTitle("Five-minute ATV safety overview")).toHaveAttribute(
    "src",
    /youtube-nocookie\.com\/embed\/y2cae_BtpfE/,
  );
  await expect(page.getByText("5:36 video")).toBeVisible();
});

test("additional FAQ answers expand on demand", async ({ page }) => {
  await page.goto("/faq");

  const guestCount = page.getByText("How many guests can Wedding Tracks accommodate?");
  await guestCount.click();
  await expect(page.getByText(/gazebo ceremony setup is designed/)).toBeVisible();
});
