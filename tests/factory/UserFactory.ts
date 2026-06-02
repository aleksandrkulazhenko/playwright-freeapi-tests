import { faker } from '@faker-js/faker';

export interface User {
  username: string;
  email: string;
  password: string;
  role: string;
}

export class UserBuilder {
  private data: User = {
    username: faker.internet.username().toLowerCase(),
    email: faker.internet.email().toLowerCase(),
    password: 'Test1234!',
    role: 'ADMIN',
  };

  withUsername(username: string): this {
    this.data.username = username;
    return this;
  }

  withEmail(email: string): this {
    this.data.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.data.password = password;
    return this;
  }

  withRole(role: string): this {
    this.data.role = role;
    return this;
  }

  build(): User {
    return { ...this.data };
  }
}

export const UserFactory = {
  build: (): User => new UserBuilder().build(),
};
