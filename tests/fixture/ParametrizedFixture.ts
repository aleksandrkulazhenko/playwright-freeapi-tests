import { test as base } from '@playwright/test';
import { ParametrizedClient } from '../client/ParametrizedClient';

type ParametrizedFixture = {
  parametrizedClient: ParametrizedClient;
};

export const test = base.extend<ParametrizedFixture>({
  parametrizedClient: async ({ request }, use) => {
    const parametrizedClient = new ParametrizedClient(request);
    await use(parametrizedClient);
  },
});
export { expect } from '@playwright/test';
