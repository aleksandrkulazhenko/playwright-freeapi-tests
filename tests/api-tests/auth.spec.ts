import * as allure from 'allure-js-commons';
import { test, expect } from '../fixture/AuthFixture';

test.describe.serial('Авторизация и пользователи', () => {
  test('POST регистрация нового пользователя', async ({ authClient }) => {
    await allure.epic('Auth');
    await allure.feature('Регистрация');
    await allure.severity('critical');

    const { status, body } = await authClient.register();
    const user = (body as any).data?.user;

    expect(status).toBe(201);
    expect((body as any).success).toBe(true);
    expect(user).toBeDefined();
    expect(typeof user._id).toBe('string');
    expect(user._id.length).toBeGreaterThan(0);
    expect(user.username).toBe(authClient.newUser.username);
    expect(user.email).toBe(authClient.newUser.email);
  });

  test('POST логин и получение токена', async ({ authClient }) => {
    await allure.epic('Auth');
    await allure.feature('Авторизация');
    await allure.severity('critical');

    await authClient.register();
    const { status, body } = await authClient.login();
    const data = (body as any).data;

    expect(status).toBe(200);
    expect((body.data as any).accessToken).toBeDefined();
    expect(typeof data.accessToken).toBe('string');
    expect(data.accessToken.length).toBeGreaterThan(10);
  });

  test('GET получение информации о залогиненном пользователе', async ({ authClient }) => {
    await allure.epic('Auth');
    await allure.feature('Текущий пользователь');
    await allure.severity('normal');

    await authClient.register();
    await authClient.login();
    const { status, body } = await authClient.getCurrentUser();
    const data = (body as any).data;

    expect(status).toBe(200);
    expect(data.username).toBe(authClient.newUser.username);
    expect(data.email).toBe(authClient.newUser.email);
    expect(typeof data._id).toBe('string');
    expect(data._id.length).toBeGreaterThan(0);
  });
});
