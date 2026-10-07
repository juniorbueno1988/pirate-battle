import { test, expect } from "@playwright/test";

test("deve simular erro 500 ao carregar o ranking", async ({ page }) => {
  await page.route("**/api/ranking**", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Erro simulado ao carregar o ranking",
      }),
    });
  });

  await page.goto("/");

  const response = await page.evaluate(async () => {
    const result = await fetch("/api/ranking");
    return result.status;
  });

  expect(response).toBe(500);
});