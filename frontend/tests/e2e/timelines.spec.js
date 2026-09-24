import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/timelines')
})

test('color-coded timeline page renders default MCU view', async ({ page }) => {
  await expect(page.getByText('SELECT UNIVERSE')).toBeVisible()
  await expect(page.getByRole('button', { name: /MCU/i })).toHaveClass(/active/)
  await expect(page.getByText('PHASE 1')).toBeVisible()
  await expect(page.getByText('IRON MAN', { exact: true })).toBeVisible()
  await expect(page.getByText('MOVIE').first()).toBeVisible()
})

test('timeline filters and search narrow visible entries', async ({ page }) => {
  await page.getByRole('button', { name: /^SHOW$/ }).click()

  await expect(page.getByText('LOKI', { exact: true })).toBeVisible()
  await expect(page.getByText('IRON MAN', { exact: true })).toHaveCount(0)

  await page.getByPlaceholder('SEARCH...').fill('wanda')
  await expect(page.getByText('WANDAVISION', { exact: true })).toBeVisible()
  await expect(page.getByText('LOKI', { exact: true })).toHaveCount(0)
})

test('timeline checklist toggles watched state and opens share modal', async ({ page }) => {
  await page.evaluate(() => localStorage.removeItem('comicverse-timeline-progress'))
  await page.reload()

  await page.getByLabel(/mark iron man as watched/i).click()
  await expect(page.getByText(/marked "iron man" as watched/i)).toBeVisible()

  await page.getByRole('button', { name: /share/i }).click()
  await expect(page.getByText(/share mcu checklist/i)).toBeVisible()
})
