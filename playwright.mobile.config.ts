import { defineConfig, devices } from '@playwright/test'
const E2E_PORT = 4311
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/mobile.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: `http://127.0.0.1:${E2E_PORT}`, trace: 'off', ...devices['Desktop Chrome'] },
  webServer: {
    command: `NEXT_DIST_DIR=.next-e2e-mobile npm run dev -- --hostname 127.0.0.1 --port ${E2E_PORT}`,
    url: `http://127.0.0.1:${E2E_PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
