import { faker } from '@faker-js/faker';
import { APIRequestContext, expect } from '@playwright/test';
import { UserFactory, User } from '../factory/UserFactory';

export class AuthClient {
  readonly request: APIRequestContext;
  readonly newUser: User;
  token: string;

  constructor(request: APIRequestContext) {
    this.request = request;
    this.newUser = UserFactory.build();
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
    const response = await this.request.post('/api/v1/users/login', {
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
