import { expect, test } from '@playwright/test'

test('mobile roster is keyboard-selectable without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const first = page.locator('.agency-grid .agency-card').first()
  await first.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Continue to profile' })).toBeEnabled()
  expect(await page.locator('.setup-steps button:visible').count()).toBe(1)
  expect(await first.evaluate((card) => getComputedStyle(card).whiteSpace)).toBe('normal')
  expect(await first.evaluate((card) => card.scrollWidth <= card.clientWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
})
