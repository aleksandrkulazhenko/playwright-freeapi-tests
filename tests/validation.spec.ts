import { test, expect } from '@playwright/test';

const productSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    price: { type: 'number' },
    description: { type: 'string' },
    stock: { type: 'number' },
    category: { type: 'string' },
  },
  required: ['_id', 'name', 'price', 'description', 'stock', 'category'],
};

test('GET product by ID, валидация JSON Schema', async ({ request }) => {
  const listResponse = await request.get('https://api.freeapi.app/api/v1/ecommerce/products');
  const listBody = await listResponse.json();
  const productId = listBody.data.products[0]._id;

  const response = await request.get(
    `https://api.freeapi.app/api/v1/ecommerce/products/${productId}`,
  );

  expect(response.status()).toBe(200);
  const body = await response.json();

  expect(body.data).toMatchObject({
    _id: expect.any(String),
    name: expect.any(String),
    price: expect.any(Number),
    description: expect.any(String),
    stock: expect.any(Number),
    category: expect.any(String),
  });
});
