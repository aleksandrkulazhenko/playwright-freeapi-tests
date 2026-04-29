import { test } from '../fixture/authClient';

test.describe.serial('Авторизация и пользователи', () => {
  test('POST регистрация нового пользователя', async ({ authClient }) => {
    await authClient.register();
  });

  test('POST логин и получение токена', async ({ authClient }) => {
    await authClient.login();
  });

  test('GET получение информации о залогиненном пользователе', async ({ authClient }) => {
    await authClient.getCurrentUser();
  });
});
