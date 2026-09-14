import { expect, test } from '@playwright/test'

test.describe('LegitMate specialist setup', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear())
    await page.goto('/')
  })

  test('moves from the full roster to a reviewable specialist setup', async ({ page }) => {
    await expect(page.locator('.setup-steps button[aria-current="step"]')).toHaveText(/Select agent/)
    const roster = page.locator('.agency-grid')
    const rosterViewport = page.locator('[data-slot="scroll-area-viewport"]')
    await expect(rosterViewport).toHaveCSS('overflow-y', 'scroll')
    await expect(roster.getByRole('button')).toHaveCount(279)
    await expect(page.getByPlaceholder('Search specialists')).toBeVisible()
    await page.getByPlaceholder('Search specialists').fill('UI Designer')
    await expect(roster.getByRole('button')).toHaveCount(1)
    await page.getByPlaceholder('Search specialists').fill('')
    await expect(roster.getByRole('button')).toHaveCount(279)
    expect(await roster.getByRole('button').evaluateAll((cards) => cards.every((card) => {
      const element = card as HTMLElement
      const bounds = element.getBoundingClientRect()
      const childrenFit = [...element.children].every((child) => {
        const childBounds = child.getBoundingClientRect()
        return childBounds.left >= bounds.left && childBounds.right <= bounds.right && childBounds.top >= bounds.top && childBounds.bottom <= bounds.bottom
      })
      return getComputedStyle(element).whiteSpace === 'normal' && getComputedStyle(element).height !== '36px' && element.scrollWidth <= element.clientWidth && element.scrollHeight <= element.clientHeight && childrenFit
    }))).toBe(true)

    await page.getByRole('button', { name: /UI Designer/ }).click()
    await page.getByRole('button', { name: 'Continue to profile' }).click()
    await expect(page.getByRole('heading', { name: 'Confirm the profile' })).toBeFocused()
    await expect(page.getByText('Review or edit profile files')).toBeVisible()

    await page.getByRole('button', { name: 'Confirm profile' }).click()
    await expect(page.getByRole('heading', { name: 'Choose provider and model' })).toBeVisible()
    await expect(page.getByText('Balanced — recommended')).toBeVisible()

    await page.route('**/api/hermes/catalog*', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, items: [{ id: 'skill:official/security/privy', kind: 'skill', name: 'Privy', description: 'Wallet workflow', source: 'official', trust: 'builtin', installable: true }], total: 1, page: 1, totalPages: 1, counts: { skills: 100148, plugins: 9 } }) })
    })
    await page.getByRole('button', { name: 'Continue to capabilities' }).click()
    await expect(page.getByRole('heading', { name: 'Add capabilities' })).toBeVisible()
    await page.getByLabel('Search Hermes capabilities').fill('privy')
    const privyCapability = page.locator('.capability-row').filter({ hasText: 'Privy' })
    await expect(privyCapability).toBeVisible()
    await privyCapability.click()

    await page.getByRole('button', { name: 'Review setup →' }).click()
    await expect(page.getByRole('heading', { name: 'Review and deploy' })).toBeVisible()
    await page.getByLabel('Instance size').selectOption('4/8')
    await expect(page.getByText('4 vCPU · 8 GB memory')).toBeVisible()
    await page.getByLabel('Instance size').selectOption('2/4')
    await expect(page.locator('.review-list').getByText('UI Designer', { exact: true })).toBeVisible()
    await expect(page.getByText('skill: Privy')).toBeVisible()
    await expect(page.getByText('Start with an outcome.')).toHaveCount(0)
  })


  test('shows a useful deploy error when the proxy returns HTML and reconciliation finds no instance', async ({ page }) => {
    test.setTimeout(45_000)
    await page.route('**/api/agents/launch/*', async (route) => {
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ ok: false, state: 'absent', found: false }) })
    })
    await page.route('**/api/agents/launch', async (route) => {
      await route.fulfill({ status: 502, contentType: 'text/html', body: '<!DOCTYPE html><title>Bad Gateway</title>' })
    })
    await page.getByRole('button', { name: /UI Designer/ }).click()
    await page.getByRole('button', { name: 'Continue to profile' }).click()
    await page.getByRole('button', { name: 'Confirm profile' }).click()
    await page.getByRole('button', { name: 'Continue to capabilities' }).click()
    await page.getByRole('button', { name: 'Review setup' }).click()
    await page.getByRole('button', { name: 'Deploy specialist' }).click()
    await expect(page.getByText(/server returned 502/i)).toBeVisible({ timeout: 20_000 })
    await expect(page.getByText(/Unexpected token/)).toHaveCount(0)
  })

  test('keeps reconciling a pending launch until configuration is complete', async ({ page }) => {
    let checks = 0
    await page.route('**/api/agents/launch/*', async (route) => {
      checks += 1
      if (checks < 3) {
        await route.fulfill({ status: 202, contentType: 'application/json', body: JSON.stringify({ ok: true, state: 'pending', instance: { id: 'inst_pending' } }) })
        return
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, state: 'complete', instance: { id: 'inst_pending', status: 'running' }, configuration: { receipt: { config_id: 'cfg_1', status: 'applied', files: [] } } }) })
    })
    await page.route('**/api/agents/launch', async (route) => {
      await route.fulfill({ status: 202, contentType: 'application/json', body: JSON.stringify({ ok: true, pending: true }) })
    })
    await page.getByRole('button', { name: /UI Designer/ }).click()
    await page.getByRole('button', { name: 'Continue to profile' }).click()
    await page.getByRole('button', { name: 'Confirm profile' }).click()
    await page.getByRole('button', { name: 'Continue to capabilities' }).click()
    await page.getByRole('button', { name: 'Review setup' }).click()
    await page.getByRole('button', { name: 'Deploy specialist' }).click()
    await expect(page.getByText(/Workspace recovered after the connection closed/)).toBeVisible({ timeout: 15_000 })
    expect(checks).toBe(3)
  })

  test('recovers a completed deployment after an HTML proxy response', async ({ page }) => {
    await page.route('**/api/agents/launch/*', async (route) => {
      const body = {
        ok: true,
        state: 'complete',
        found: true,
        instance: { id: 'inst_recovered', status: 'running', url: 'https://inst_recovered.agent37.app' },
        configuration: {
          status: 'applied',
          verification: { verified: true },
          receipt: { config_id: 'cfg_1', status: 'applied', files: [] },
        },
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
    })
    await page.route('**/api/agents/launch', async (route) => {
      await route.fulfill({ status: 502, contentType: 'text/html', body: '<!DOCTYPE html><title>Bad Gateway</title>' })
    })
    await page.getByRole('button', { name: /UI Designer/ }).click()
    await page.getByRole('button', { name: 'Continue to profile' }).click()
    await page.getByRole('button', { name: 'Confirm profile' }).click()
    await page.getByRole('button', { name: 'Continue to capabilities' }).click()
    await page.getByRole('button', { name: 'Review setup' }).click()
    await page.getByRole('button', { name: 'Deploy specialist' }).click()
    await expect(page.getByText(/Workspace recovered after the connection closed/)).toBeVisible()
    await expect(page.locator('body > canvas')).toBeAttached()
    await expect(page.getByText(/server returned 502/i)).toHaveCount(0)
  })
})
