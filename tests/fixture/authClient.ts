import { test as base } from '@playwright/test';
import { AuthClient } from '../client/AuthClient';

type AuthFixture = {
  authClient: AuthClient;
};

export const test = base.extend<AuthFixture>({
  authClient: async ({ request }, use) => {
    const authClient = new AuthClient(request);
    await use(authClient);
  },
});
export { expect } from '@playwright/test';
