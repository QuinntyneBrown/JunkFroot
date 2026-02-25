import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './projects/junk-froot/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 30_000,
  use: {
    baseURL: process.env['E2E_BASE_URL'] || 'http://localhost:4202',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npx ng serve junk-froot --port 4202',
    url: 'http://localhost:4202',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
