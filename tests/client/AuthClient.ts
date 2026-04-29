import { faker } from '@faker-js/faker';
import { APIRequestContext, expect } from '@playwright/test';

interface User {
  username: string;
  email: string;
  password: string;
  role: string;
}

export class AuthClient {
  readonly request: APIRequestContext;
  readonly newUser: User;
  token: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.newUser = {
      username: faker.internet.username().toLowerCase(),
      email: faker.internet.email(),
      password: 'Test1234!',
      role: 'ADMIN',
    };
    this.token = '';
  }

  async register() {
    const response = await this.request.post('https://api.freeapi.app/api/v1/users/register', {
      data: this.newUser,
    });

    const body = await response.json();
    expect(response.status()).toBe(201);
    expect(body.data.user.username).toBe(this.newUser.username);
  }

  async login() {
    await this.register();
    const response = await this.request.post('https://api.freeapi.app/api/v1/users/login', {
      data: {
        username: this.newUser.username,
        password: this.newUser.password,
      },
    });

    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.data.accessToken).toBeDefined();

    this.token = body.data.accessToken;
  }

  async getCurrentUser() {
    await this.login();
    const response = await this.request.get('https://api.freeapi.app/api/v1/users/current-user', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.username).toBe(this.newUser.username);
  }
}
