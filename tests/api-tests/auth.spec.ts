import { test } from '@playwright/test';
import { AuthClient } from '../client/AuthClient';

test.describe.serial('Авторизация и пользователи', () => {
  test('POST регистрация нового пользователя', async ({ request }) => {
    const authClient = new AuthClient(request);
    await authClient.register();
  });

  test('POST логин и получение токена', async ({ request }) => {
    const authClient = new AuthClient(request);
    await authClient.login();
  });

  test('GET получение информации о залогиненном пользователе', async ({ request }) => {
    const authClient = new AuthClient(request);
    await authClient.getCurrentUser();
  });
});
