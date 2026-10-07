import { test, expect } from "@playwright/test";

test("deve persistir as opções após recarregar a página", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "OPÇÕES" }).click();

  const durationInput = page.locator("#session-duration");

  await durationInput.fill("120");

  await page.getByRole("button", { name: "SALVAR" }).click();

  await page.reload();

  await page.getByRole("button", { name: "OPÇÕES" }).click();

  await expect(durationInput).toHaveValue("120");
});