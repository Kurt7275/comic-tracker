import { expect, test } from '@playwright/test'

test('room portal renders the landing preview', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.miles-room-view')).toBeVisible()
  await expect(page.locator('.portal-container')).toBeVisible()
  await expect(page.locator('.monitor-landing-preview')).toBeVisible()
})

test('landing page can navigate to login', async ({ page }) => {
  await page.goto('/landing')

  await expect(page.getByRole('heading', { name: /your comics/i })).toBeVisible()
  await page.locator('#f-hero-start-btn').click()

  await expect(page).toHaveURL(/\/login/)
  await expect(page.locator('#btn-google-signin')).toBeVisible()
  await expect(page.getByText(/sign in with google/i)).toBeVisible()
})

test('login page displays sign-in card and back button returns to landing', async ({ page }) => {
  await page.goto('/login')

  await expect(page.getByText('YOUR ULTIMATE READING TRACKER!')).toBeVisible()
  await expect(page.getByText('SIGN IN TO CONTINUE!')).toBeVisible()
  await expect(page.locator('#btn-google-signin')).toBeVisible()

  await page.locator('.cs-login-back-btn').click()
  await expect(page).toHaveURL(/\/landing/)
})

test('successful auth callback logs the user in and opens the shelf', async ({ page }) => {
  await page.goto('/auth/callback?name=Miles%20Morales&email=miles@spidey.com')

  await expect(page).toHaveURL(/\/shelf/)
  await expect(page.locator('.cs-stat-card.card-total')).toBeVisible()
  await expect(page.getByText(/titles completed/i)).toBeVisible()
})

