import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const priceCases = [{ price: '0' }, { price: '999999999' }, { price: '-1' }];

for (const { price } of priceCases) {
  test(`POST проверка создания продукта с ценой: ${price}`, async ({ request }) => {
    const response = await request.post('https://api.freeapi.app/api/v1/ecommerce/products', {
      multipart: {
        name: `Test Product`,
        description: 'Test Description',
        price: price,
        stock: '10',
        category: process.env.CATEGORY_ID!,
        mainImage: {
          name: 'icon.png',
          mimeType: 'image/png',
          buffer: fs.readFileSync(path.join(__dirname, '../data/icon.png')),
        },
      },
    });

    expect([200, 201, 400, 422]).toContain(response.status());
  });
}
