import { APIRequestContext } from '@playwright/test';
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
    const response = await this.request.post('/api/v1/users/register', {
      data: this.newUser,
    });
    const body = await response.json();
    return { status: response.status(), body };
  }

  async login() {
    const response = await this.request.post('/api/v1/users/login', {
      data: {
        username: this.newUser.username,
        password: this.newUser.password,
      },
    });
    const body = await response.json();
    this.token = body?.data?.accessToken ?? '';
    return { status: response.status(), body };
  }

  async getCurrentUser() {
    const response = await this.request.get('/api/v1/users/current-user', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    const body = await response.json();
    return { status: response.status(), body };
  }
}
