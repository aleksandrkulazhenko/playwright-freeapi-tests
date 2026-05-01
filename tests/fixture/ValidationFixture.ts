import { test as base } from '@playwright/test';
import { ValidationClient } from '../client/ValidationClient';

type ValidationFixture = {
  validationClient: ValidationClient;
};

export const test = base.extend<ValidationFixture>({
  validationClient: async ({ request }, use) => {
    const validationClient = new ValidationClient(request);
    await use(validationClient);
  },
});
export { expect } from '@playwright/test';
