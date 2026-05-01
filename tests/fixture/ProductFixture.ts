import { test as base } from '@playwright/test';
import { ProductClient } from '../client/ProductClient';

type productFixture = {
  productClient: ProductClient;
};

export const test = base.extend<productFixture>({
  productClient: async ({ request }, use) => {
    const productClient = new ProductClient(request);
    await use(productClient);
  },
});
export { expect } from '@playwright/test';
