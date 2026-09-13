import { expect, test } from '@playwright/test'

test.describe('LegitMate specialist setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear())
    await page.goto('/')
  })

  test('moves from the full roster to a reviewable specialist setup', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Select an agent' })).toBeVisible()
    const roster = page.locator('.agency-grid')
    await expect(roster).toHaveCSS('overflow-y', 'auto')
    await expect(roster.getByRole('button')).toHaveCount(279)

    await page.getByRole('button', { name: /UI Designer/ }).click()
    await page.getByRole('button', { name: 'Continue to profile' }).click()
    await expect(page.getByRole('heading', { name: 'Confirm the profile' })).toBeVisible()
    await expect(page.getByText('Review or edit profile files')).toBeVisible()

    await page.getByRole('button', { name: 'Confirm profile' }).click()
    await expect(page.getByRole('heading', { name: 'Choose provider and model' })).toBeVisible()
    await expect(page.getByText('Balanced — recommended')).toBeVisible()

    await page.getByRole('button', { name: 'Continue to capabilities' }).click()
    await expect(page.getByRole('heading', { name: 'Add capabilities' })).toBeVisible()
    const privyCapability = page.locator('.capability-row').filter({ hasText: /^skillprivy/ })
    const agencyCapability = page.locator('.capability-row').filter({ hasText: /^pluginagency agents router/ })
    await expect(privyCapability).toBeVisible()
    await expect(agencyCapability).toBeVisible()
    await privyCapability.click()

    await page.getByRole('button', { name: 'Review setup' }).click()
    await expect(page.getByRole('heading', { name: 'Review and deploy' })).toBeVisible()
    await expect(page.locator('.review-list').getByText('UI Designer', { exact: true })).toBeVisible()
    await expect(page.getByText('skill: privy')).toBeVisible()
    await expect(page.getByText('Start with an outcome.')).toHaveCount(0)
  })


  test('shows a useful deploy error when the proxy returns HTML', async ({ page }) => {
    await page.route('**/api/agents/launch', async (route) => {
      await route.fulfill({ status: 502, contentType: 'text/html', body: '<!DOCTYPE html><title>Bad Gateway</title>' })
    })
    await page.getByRole('button', { name: /UI Designer/ }).click()
    await page.getByRole('button', { name: 'Continue to profile' }).click()
    await page.getByRole('button', { name: 'Confirm profile' }).click()
    await page.getByRole('button', { name: 'Continue to capabilities' }).click()
    await page.getByRole('button', { name: 'Review setup' }).click()
    await page.getByRole('button', { name: 'Deploy specialist' }).click()
    await expect(page.getByText(/server returned 502/i)).toBeVisible()
    await expect(page.getByText(/Unexpected token/)).toHaveCount(0)
  })
})
