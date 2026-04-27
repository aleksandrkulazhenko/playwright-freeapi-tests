import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe.serial('Авторизация и пользователи', () => {
  let token: string = '';
  const newUser = {
    username: faker.internet.username().toLowerCase(),
    email: faker.internet.email(),
    password: 'Test1234!',
    role: 'ADMIN',
  };

  test('POST регистрация нового пользователя', async ({ request }) => {
    const response = await request.post('https://api.freeapi.app/api/v1/users/register', {
      data: newUser,
    });

    const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.data.user.username).toBe(newUser.username);
  });

  test('POST логин и получение токена', async ({ request }) => {
    const response = await request.post('https://api.freeapi.app/api/v1/users/login', {
      data: {
        username: newUser.username,
        password: newUser.password,
      },
    });

    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.data.accessToken).toBeDefined();

    token = body.data.accessToken;
  });

  test('GET получение информации о залогиненном пользователе', async ({ request }) => {
    const response = await request.get('https://api.freeapi.app/api/v1/users/current-user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.username).toBe(newUser.username);
  });
});
