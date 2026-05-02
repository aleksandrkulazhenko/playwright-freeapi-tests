import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  globalSetup: './global-setup.ts',
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        suiteTitle: true,
        environmentInfo: {
          base_url: 'https://api.freeapi.app',
          node_version: process.version,
        },
      },
    ],
  ],
  use: {
    baseURL: 'https://api.freeapi.app',
    extraHTTPHeaders: {
      get Authorization() {
        return `Bearer ${process.env.API_TOKEN}`;
      },
    },
    trace: 'on-first-retry',
  },
});
