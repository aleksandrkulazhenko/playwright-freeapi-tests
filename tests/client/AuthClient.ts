import { APIRequestContext } from '@playwright/test';
import { UserFactory, User } from '../factory/UserFactory';
import { getMethod, postMethod } from '../helper/ApiHelper';

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
    return postMethod(this.request, '/api/v1/users/register', {
      data: this.newUser,
    });
  }

  async login() {
    const result = await postMethod<any>(this.request, '/api/v1/users/login', {
      data: {
        username: this.newUser.username,
        password: this.newUser.password,
      },
    });
    this.token = result.body?.data?.accessToken ?? '';
    return result;
  }

  async getCurrentUser() {
    return getMethod(this.request, '/api/v1/users/current-user', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
