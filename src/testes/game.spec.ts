import { test, expect } from '@playwright/test'

test('deve abrir o Pirate Battle', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  await expect(
    page.getByRole('heading', { name: 'PIRATE BATTLE' }),
  ).toBeVisible()

  await expect(
    page.getByRole('button', { name: 'JOGAR' }),
  ).toBeVisible()
})

test('deve iniciar uma partida', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  await page.getByRole('button', { name: 'JOGAR' }).click()

  await expect(
    page.getByText('PixiJS + React + TypeScript'),
  ).toBeVisible()
})