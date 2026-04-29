import { test as base } from '@playwright/test';
import { ProductClient } from '../client/ProductClient';

// Declare the types of your fixtures.
type MyFixtures = {
  productClient: ProductClient;
};

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({
  productClient: async ({ request }, use) => {
    // Set up the fixture.
    const productClient = new ProductClient(request);

    // Use the fixture value in the test.
    await use(productClient);
  },
});
export { expect } from '@playwright/test';
