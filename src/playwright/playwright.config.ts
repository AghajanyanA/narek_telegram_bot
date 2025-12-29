import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './.',
  fullyParallel: true,
  retries: 2,
  workers: 5,
  reporter: 'null',
  use: {
    trace: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
