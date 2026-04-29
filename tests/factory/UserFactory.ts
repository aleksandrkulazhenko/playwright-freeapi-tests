// tests/factories/UserFactory.ts
import { faker } from '@faker-js/faker';

export interface User {
  username: string;
  email: string;
  password: string;
  role: string;
}

export const UserFactory = {
  build: (overrides: Partial<User> = {}): User => ({
    username: faker.internet.username().toLowerCase(),
    email: faker.internet.email(),
    password: 'Test1234!',
    role: 'ADMIN' as const,
    ...overrides,
  }),
};
