import * as allure from 'allure-js-commons';
import { test, expect } from '../fixture/AuthFixture';

test.describe.serial('Авторизация и пользователи', () => {
  test('POST регистрация нового пользователя', async ({ authClient }) => {
    await allure.epic('Auth');
    await allure.feature('Регистрация');
    await allure.severity('critical');

    const { status, body } = await authClient.register();

    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect((body.data as any).user.username).toBe(authClient.newUser.username);
  });

  test('POST логин и получение токена', async ({ authClient }) => {
    await allure.epic('Auth');
    await allure.feature('Авторизация');
    await allure.severity('critical');

    await authClient.register();
    const { status, body } = await authClient.login();

    expect(status).toBe(200);
    expect((body.data as any).accessToken).toBeDefined();
    expect(typeof (body.data as any).accessToken).toBe('string');
  });

  test('GET получение информации о залогиненном пользователе', async ({ authClient }) => {
    await allure.epic('Auth');
    await allure.feature('Текущий пользователь');
    await allure.severity('normal');

    await authClient.register();
    await authClient.login();
    const { status, body } = await authClient.getCurrentUser();

    expect(status).toBe(200);
    expect((body.data as any).username).toBe(authClient.newUser.username);
    expect((body.data as any).email).toBe(authClient.newUser.email);
  });
});
