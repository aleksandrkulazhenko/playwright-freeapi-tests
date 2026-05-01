import { test as base } from '@playwright/test';
import { NegativeClient } from '../client/NegativeClient';

type NegativeFixture = {
  negativeClient: NegativeClient;
};

export const test = base.extend<NegativeFixture>({
  negativeClient: async ({ request }, use) => {
    const negativeClient = new NegativeClient(request);
    await use(negativeClient);
  },
});
export { expect } from '@playwright/test';
