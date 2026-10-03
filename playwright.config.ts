import { defineConfig, devices } from '@playwright/test';
const base = process.env.E2E_SITE_BASE || '/';
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.ts', fullyParallel: true,
  workers: process.env.CI ? 2 : 3, retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: `http://127.0.0.1:4173${base}`, channel: process.env.PLAYWRIGHT_CHANNEL || undefined, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } }],
  webServer: { command: 'node tests/e2e-server.mjs', url: `http://127.0.0.1:4173${base}api/health/ready`, reuseExistingServer: false },
});
