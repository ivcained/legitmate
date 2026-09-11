import { defineConfig, devices } from '@playwright/test'

const E2E_PORT = 4310

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:${E2E_PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run dev -- --hostname 127.0.0.1 --port ${E2E_PORT}`,
    url: `http://127.0.0.1:${E2E_PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
