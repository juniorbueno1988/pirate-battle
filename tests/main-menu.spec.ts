import { test, expect } from "@playwright/test";

test("deve exibir o menu principal", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "PIRATE BATTLE" }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "JOGAR" }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "OPÇÕES" }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "HISTÓRICO DE PARTIDAS" }),
  ).toBeVisible();
});

test("deve iniciar uma partida", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "JOGAR" }).click();

  await expect(page.locator("canvas")).toBeVisible();
});

test("deve abrir as opções", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "OPÇÕES" }).click();

  await expect(
    page.getByRole("heading", { name: "OPÇÕES" }),
  ).toBeVisible();
});

test("deve abrir o ranking", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Ranking" }),
  ).toBeVisible();
});

test("deve abrir o histórico de partidas", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "HISTÓRICO DE PARTIDAS" }).click();

  await expect(
    page.getByRole("heading", { name: "HISTÓRICO DE PARTIDAS" }),
  ).toBeVisible();
});