import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function expectNoContrastViolations(page: Page, label: string) {
  await page.waitForTimeout(320)
  const results = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze()
  expect(results.violations, `${label}: ${results.violations.flatMap((violation) => violation.nodes.map((node) => `${node.target.join(' ')} — ${node.failureSummary ?? violation.help}`)).join('\n')}`).toEqual([])
}

async function mockCatalog(page: Page) {
  await page.route('**/api/hermes/catalog*', async (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      ok: true,
      items: [
        { id: 'skill:official/security/privy', kind: 'skill', name: 'Privy', description: 'Wallet workflow', source: 'official', trust: 'builtin', installable: true },
        { id: 'plugin:example', kind: 'plugin', name: 'Example plugin', description: 'Unavailable plugin', source: 'official', trust: 'official', installable: false, reason: 'Platform compatibility is not declared' },
      ],
      total: 2,
      page: 1,
      totalPages: 1,
      counts: { skills: 100148, plugins: 9 },
    }),
  }))
}

for (const theme of ['dark', 'light'] as const) {
  test(`commissioning surfaces meet WCAG contrast in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('legitmate.theme', value), theme)
    await mockCatalog(page)
    await page.goto('/')
    await expectNoContrastViolations(page, `${theme} initial roster`)

    await page.locator('.agency-card').first().click()
    await expectNoContrastViolations(page, `${theme} selected roster`)

    await page.getByRole('button', { name: 'Continue to profile' }).click()
    await expect(page.getByRole('heading', { name: 'Confirm the profile' })).toBeVisible()
    await expectNoContrastViolations(page, `${theme} profile`)

    await page.getByRole('button', { name: 'Confirm profile' }).click()
    await expect(page.getByRole('heading', { name: 'Choose provider and model' })).toBeVisible()
    await expectNoContrastViolations(page, `${theme} provider`)

    await page.getByRole('button', { name: 'Continue to capabilities' }).click()
    await expect(page.getByRole('heading', { name: 'Add capabilities' })).toBeVisible()
    await expect(page.locator('.capability-row')).toHaveCount(2)
    await expectNoContrastViolations(page, `${theme} capabilities`)

    await page.locator('.capability-row').filter({ hasText: 'Privy' }).click()
    await expectNoContrastViolations(page, `${theme} selected capability`)

    await page.getByRole('button', { name: 'Review setup' }).click()
    await expect(page.getByRole('heading', { name: 'Review and deploy' })).toBeVisible()
    await expectNoContrastViolations(page, `${theme} review`)
  })
}
