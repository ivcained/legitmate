import { expect, test } from '@playwright/test'

test('lists account-owned deployed instances and opens management', async ({ page }) => {
  await page.route('**/api/agents/instances', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, data: [
      { id: 'inst_1', name: 'Desktop App Engineer', specialist: 'Desktop App Engineer', status: 'running', template: 'agent37-hermes', created: 1_789_200_000, resources: { cpu: 2, memory: 4, disk: 6 }, budget: { monthly_cap_micros: 5_000_000 } },
      { id: 'inst_2', name: 'Research Agent', specialist: 'Research Agent', status: 'stopped', template: 'agent37-hermes', created: 1_789_100_000, resources: { cpu: 4, memory: 8, disk: 12 } },
    ] }) })
  })
  await page.goto('/instances')
  await expect(page.getByRole('heading', { name: 'Your instances.' })).toBeVisible()
  await expect(page.locator('.instance-total').getByText('2')).toBeVisible()
  await expect(page.locator('.instance-total').getByText(/1 active/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Desktop App Engineer' })).toBeVisible()
  await expect(page.getByText('running', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Manage instance' }).first()).toHaveAttribute('href', '/instances/inst_1')
})

test('opens a managed instance without leaving stale loading copy', async ({ page }) => {
  await page.route('**/api/agents/instances/inst_1/integrations', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, toolkits: [{ slug: 'gmail', name: 'Gmail', description: 'Email', enabled: true, isNoAuth: false }], connections: [] }) })
  })
  await page.route('**/api/agents/instances/inst_1', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, instance: { id: 'inst_1', name: 'Desktop App Engineer', status: 'running', template: 'agent37-hermes', resources: { cpu: 2, memory: 4, disk: 6 } } }) })
  })
  await page.goto('/instances/inst_1')
  await expect(page.getByRole('heading', { name: 'Desktop App Engineer' })).toBeVisible()
  await expect(page.getByText('Loading instance…')).toHaveCount(0)
  for (const label of ['Chat', 'Terminal', 'Files', 'Integrations', 'Settings', 'Hermes Dashboard']) await expect(page.getByText(label, { exact: true }).first()).toBeVisible()
  await expect(page.getByText('Gmail', { exact: true })).toBeVisible()
})
