import { test as base } from '@playwright/test';
import { AuthClient } from '../client/AuthClient';

// Declare the types of your fixtures.
type MyFixtures = {
  authFixture: AuthClient;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
  authFixture: async ({ request }, use) => {
    // Set up the fixture.
    const authFixture = new AuthClient(request);

    // Use the fixture value in the test.
    await use(authFixture);
  },
});
export { expect } from '@playwright/test';
