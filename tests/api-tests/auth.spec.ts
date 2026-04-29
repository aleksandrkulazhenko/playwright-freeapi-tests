import { test } from '../fixture/authFixture';

test.describe.serial('Авторизация и пользователи', () => {
  test('POST регистрация нового пользователя', async ({ authFixture }) => {
    await authFixture.register();
  });

  test('POST логин и получение токена', async ({ authFixture }) => {
    await authFixture.login();
  });

  test('GET получение информации о залогиненном пользователе', async ({ authFixture }) => {
    await authFixture.getCurrentUser();
  });
});
