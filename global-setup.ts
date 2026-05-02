import { request } from '@playwright/test';

async function globalSetup() {
  const context = await request.newContext();

  await context.post('https://api.freeapi.app/api/v1/users/register', {
    data: {
      username: process.env.USER_USERNAME,
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
      role: 'ADMIN',
    },
  });

  const response = await context.post('https://api.freeapi.app/api/v1/users/login', {
    data: {
      username: process.env.USER_USERNAME,
      password: process.env.USER_PASSWORD,
    },
  });

  const body = await response.json();

  const token = body.data.accessToken;
  process.env.API_TOKEN = token;

  const categoryResponse = await context.post(
    'https://api.freeapi.app/api/v1/ecommerce/categories',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name: 'Test Category',
      },
    },
  );

  const categoryBody = await categoryResponse.json();
  process.env.CATEGORY_ID = categoryBody.data._id;

  await context.dispose();
}

export default globalSetup;
