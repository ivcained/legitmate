import { expect, test } from '@playwright/test'

const brief = 'Each Monday, research emerging Ethereum topics and prepare three video concepts for review. Never publish without approval.'

async function approveEveryPermission(page: import('@playwright/test').Page) {
  for (const name of ['Read channel details', 'Read channel analytics', 'Create video drafts']) {
    const row = page.locator('.permission-row').filter({ hasText: name })
    await row.getByRole('button', { name: 'Approve', exact: true }).click()
  }
}

async function startFromBrief(page: import('@playwright/test').Page) {
  await page.goto('/')
  await page.getByLabel('Describe the work').fill(brief)
  await page.getByRole('button', { name: 'Prepare my setup' }).click()
  await expect(page.getByRole('heading', { name: 'Your setup, on paper.' })).toBeVisible()
}

test.describe('LegitMate commissioning flow', () => {
  test('commissions a sandbox assistant from brief through audit', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Use Ethereum creator example' }).click()
    await expect(page.getByLabel('Describe the work')).toHaveValue(brief)
    await page.getByRole('button', { name: 'Prepare my setup' }).click()

    await expect(page.getByRole('heading', { name: 'Your setup, on paper.' })).toBeVisible()
    await expect(page.getByText('Requested permissions')).toBeVisible()
    await approveEveryPermission(page)
    await page.getByRole('button', { name: 'Review access & plan' }).click()

    await expect(page.getByRole('heading', { name: 'Choose the room.' })).toBeVisible()
    await page.getByRole('button', { name: 'Provision sandbox' }).click()
    await expect(page.getByRole('heading', { name: 'A quiet, isolated trial.' })).toBeVisible()

    await page.getByRole('button', { name: 'Run isolated trial' }).click()
    await expect(page.getByText('Research Ethereum questions your audience is asking')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ready for your approval.' })).toBeVisible()

    const activate = page.getByRole('button', { name: 'Approve and activate' })
    await expect(activate).toBeDisabled()
    await page.getByText('I understand this setup is simulated, isolated, and inactive until I approve it.').click()
    await expect(activate).toBeEnabled()
    await activate.click()

    await expect(page.getByRole('heading', { name: 'The desk is ready.' })).toBeVisible()
    await expect(page.getByText('ACTIVE · ISOLATED')).toBeVisible()
    await expect(page.getByText('Activation approved explicitly')).toBeVisible()
    await expect(page.getByText('No content has been published.')).toBeVisible()
  })

  test('restores an in-progress commissioning state after refresh', async ({ page }) => {
    await startFromBrief(page)
    await approveEveryPermission(page)
    await page.getByRole('button', { name: 'Review access & plan' }).click()
    await page.getByRole('button', { name: 'Provision sandbox' }).click()
    await expect(page.getByRole('heading', { name: 'A quiet, isolated trial.' })).toBeVisible()

    await page.reload()
    await expect(page.getByRole('heading', { name: 'A quiet, isolated trial.' })).toBeVisible()
    await expect(page.getByText('TRIAL TASK / READ-ONLY')).toBeVisible()
  })
})
