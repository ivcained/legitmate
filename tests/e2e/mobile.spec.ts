import { expect, test } from '@playwright/test'

test('mobile roster is keyboard-selectable without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark')
  await page.getByRole('button', { name: 'Switch to light mode' }).click()
  expect(await page.evaluate(() => ({ theme: document.documentElement.dataset.theme, saved: localStorage.getItem('legitmate.theme') }))).toEqual({ theme: 'light', saved: 'light' })
  await expect(page.getByRole('button', { name: 'Switch to dark mode' })).toBeVisible()
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark')
  const first = page.locator('.agency-grid .agency-card').first()
  await first.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Continue to profile' })).toBeEnabled()
  expect(await page.locator('.setup-steps button:visible').count()).toBe(1)
  expect(await first.evaluate((card) => {
    const element = card as HTMLElement
    const bounds = element.getBoundingClientRect()
    return getComputedStyle(element).whiteSpace === 'normal' && getComputedStyle(element).height !== '36px' && element.scrollWidth <= element.clientWidth && element.scrollHeight <= element.clientHeight && [...element.children].every((child) => {
      const childBounds = child.getBoundingClientRect()
      return childBounds.left >= bounds.left && childBounds.right <= bounds.right && childBounds.top >= bounds.top && childBounds.bottom <= bounds.bottom
    })
  })).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
})
