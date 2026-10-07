import { test, expect } from "@playwright/test";

test("deve manter o visual do menu principal", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveScreenshot("main-menu.png", {
    fullPage: true,
  });
});