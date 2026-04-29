import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Поиск багов', () => {
  test('GET продукт с невалидным ID (404)', async ({ request }) => {
    const response = await request.get(
      'https://api.freeapi.app/api/v1/ecommerce/products/999999999900000000001234',
    );

    expect(response.status()).toBe(404);
  });

  test('POST создание продукта без токена (401)', async ({ request }) => {
    const response = await request.post('https://api.freeapi.app/api/v1/ecommerce/products', {
      multipart: {
        name: 'Test Product',
        description: 'Test Description',
        price: '100',
        stock: '10',
        category: process.env.CATEGORY_ID!,
        mainImage: {
          name: 'icon.png',
          mimeType: 'image/png',
          buffer: fs.readFileSync(path.join(__dirname, '../../data/products.json')),
        },
      },
      headers: {
        Authorization: '',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('POST создание продукта с невалидной ценой (400)', async ({ request }) => {
    const response = await request.post('https://api.freeapi.app/api/v1/ecommerce/products', {
      multipart: {
        name: 'Test Product',
        description: 'Test Description',
        price: 'сто',
        stock: '10',
        category: process.env.CATEGORY_ID!,
        mainImage: {
          name: 'icon.png',
          mimeType: 'image/png',
          buffer: fs.readFileSync(path.join(__dirname, '../../data/products.json')),
        },
      },
    });

    expect(response.status()).toBe(422);
  });
});
