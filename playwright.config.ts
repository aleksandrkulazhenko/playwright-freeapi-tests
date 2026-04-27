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
  reporter: [['allure-playwright', { outputFolder: 'allure-results' }]],
  use: {
    baseURL: 'https://api.freeapi.app',
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
    trace: 'on-first-retry',
  },
});
