import { expect, test } from '@playwright/test'

test('lists account-owned deployed instances and opens management', async ({ page }) => {
  await page.route('**/api/agents/instances', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true, data: [
      { id: 'ab12cd34ef', name: 'UI Designer', status: 'running', template: 'agent37-hermes', specialist: 'ui-designer', created: 1789200000, resources: { cpu: 2, memory: 4, disk: 6 }, budget: { monthly_cap_micros: 5000000 } },
      { id: 'zz98yy76xx', name: 'Research Analyst', status: 'stopped', template: 'agent37-hermes', specialist: 'research-analyst', created: 1789100000, resources: { cpu: 2, memory: 4, disk: 6 } },
    ] }) })
  })
  await page.goto('/instances')
  await expect(page.getByRole('heading', { name: 'Your instances.' })).toBeVisible()
  await expect(page.getByText('2', { exact: true })).toBeVisible()
  await expect(page.getByText('1 active')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'UI Designer' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Research Analyst' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Manage instance' }).first()).toHaveAttribute('href', '/instances/ab12cd34ef')
})
