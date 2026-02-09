import { defineConfig, devices } from '@playwright/test';

// IMPORTANT: Point this at your STAGING URL, not production
const BASE_URL = process.env.BASE_URL || 'https://thepagegalleryjournal.com';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  retries: 1,
  workers: 5, // 5 parallel browser instances

  reporter: [
    ['html', { outputFolder: 'results/html-report' }],
    ['json', { outputFile: 'results/test-results.json' }],
    ['list']
  ],

  use: {
    baseURL: BASE_URL,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] },
    },
  ],
});
