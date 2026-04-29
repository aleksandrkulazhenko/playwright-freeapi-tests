import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { faker } from '@faker-js/faker';
import * as path from 'path';

test('GET всех продуктов, проверка cтатуса 200 и сохранение локально', async ({ request }) => {
  const response = await request.get(
    'https://api.freeapi.app/api/v1/public/randomproducts?page=1&limit=10&inc=category%252Cprice%252Cthumbnail%252Cimages%252Ctitle%252Cid&query=mens-watches',
  );
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body.data.data)).toBe(true);

  fs.writeFileSync(path.join(__dirname, '../../data/products.json'), JSON.stringify(body, null, 2));
});

test.describe.serial('CRUD продуктов', () => {
  let productId: string = '';
  let productName: string = '';

  test('POST создание нового продукта, проверка статуса 201 и наличия id', async ({ request }) => {
    const newProduct = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.int({ min: 10, max: 9999 }).toString(),
      stock: faker.number.int({ min: 1, max: 100 }).toString(),
      category: process.env.CATEGORY_ID!,
      mainImage: {
        name: 'icon.png',
        mimeType: 'image/png',
        buffer: fs.readFileSync(path.join(__dirname, '../../data/products.json')),
      },
    };

    const response = await request.post('https://api.freeapi.app/api/v1/ecommerce/products', {
      multipart: newProduct,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body.data._id).toBeDefined();

    productId = body.data._id;
    productName = body.data.name;
  });

  test('GET поиск созданного продукта по ID и проверка имени', async ({ request }) => {
    const response = await request.get(
      `https://api.freeapi.app/api/v1/ecommerce/products/${productId}`,
    );

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.data.name).toBe(productName);
  });

  test('PATCH обновление и проверка цены продукта', async ({ request }) => {
    const newPrice = faker.number.int({ min: 10, max: 9999 }).toString();

    const response = await request.patch(
      `https://api.freeapi.app/api/v1/ecommerce/products/${productId}`,
      {
        data: {
          price: newPrice,
          category: process.env.CATEGORY_ID,
        },
      },
    );

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.data.price.toString()).toBe(newPrice);
  });

  test('DELETE удаление продукта', async ({ request }) => {
    const response = await request.delete(
      `https://api.freeapi.app/api/v1/ecommerce/products/${productId}`,
    );

    expect([200, 204]).toContain(response.status());
  });
});
