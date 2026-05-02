import * as allure from 'allure-js-commons';
import { test, expect } from '../fixture/ValidationFixture';
import { productSchema } from '../factory/SchemaFactory';
import Ajv from 'ajv';

const ajv = new Ajv();

test.describe('Валидация JSON Schema', () => {
  test('GET product by ID — ответ соответствует JSON Schema', async ({ validationClient }) => {
    await allure.epic('Advanced');
    await allure.feature('JSON Schema валидация');
    await allure.severity('normal');

    const { status: listStatus, body: listBody } = await validationClient.getRandomProducts();

    expect(listStatus).toBe(200);

    const products = (listBody.data as any).data as any[];
    expect(products.length, 'Список продуктов пуст').toBeGreaterThan(0);

    const productId = products[0].id;
    const { status, body } = await validationClient.getProductById(productId);

    expect(status).toBe(200);
    expect(body.success).toBe(true);

    const data = body.data;

    expect(data).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      price: expect.any(Number),
      description: expect.any(String),
      stock: expect.any(Number),
      category: expect.any(String),
    });

    const validate = ajv.compile(productSchema);
    const isValid = validate(data);
    expect(validate.errors, JSON.stringify(validate.errors)).toBeNull();
    expect(isValid).toBe(true);
  });
});
