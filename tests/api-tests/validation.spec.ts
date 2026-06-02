import * as allure from 'allure-js-commons';
import { test, expect } from '../fixture/ValidationFixture';
import { ProductSchemaForValidationTests } from '../factory/SchemaFactory';
import Ajv from 'ajv';

const ajv = new Ajv();

test.describe('Валидация JSON Schema', () => {
  test('GET product by ID — ответ соответствует JSON Schema', async ({ validationClient }) => {
    await allure.epic('Advanced');
    await allure.feature('JSON Schema валидация');
    await allure.severity('normal');

    const { status: listStatus, body: listBody } = await validationClient.getRandomProducts();

    expect(listStatus).toBe(200);

    const products = ((listBody as any).data as any).data as any[];
    expect(products.length, 'Список продуктов пуст').toBeGreaterThan(0);

    const productId = products[0].id;
    const { status, body } = await validationClient.getProductById(productId);
    const data = (body as any).data;

    expect(status).toBe(200);
    expect((body as any).success).toBe(true);
    expect(typeof data.id).toBe('number');
    expect(typeof data.title).toBe('string');
    expect(data.title.length).toBeGreaterThan(0);
    expect(typeof data.price).toBe('number');
    expect(data.price).toBeGreaterThan(0);
    expect(typeof data.description).toBe('string');
    expect(typeof data.stock).toBe('number');
    expect(typeof data.category).toBe('string');

    if (data.thumbnail) {
      expect(data.thumbnail).toMatch(/^https?:\/\//);
    }

    if (data.images) {
      expect(Array.isArray(data.images)).toBe(true);
      for (const img of data.images) {
        expect(typeof img).toBe('string');
      }
    }

    const validate = ajv.compile(ProductSchemaForValidationTests);
    const isValid = validate(data);
    expect(validate.errors, JSON.stringify(validate.errors)).toBeNull();
    expect(isValid).toBe(true);
  });

  test('GET список продуктов - каждый элемент валиден по схеме', async ({ validationClient }) => {
    await allure.epic('Advanced');
    await allure.feature('JSON Schema валидация');
    await allure.severity('minor');

    const { status, body } = await validationClient.getRandomProducts();
    expect(status).toBe(200);

    const products = ((body as any).data as any).data as any[];
    expect(products.length).toBeGreaterThan(0);

    const validate = ajv.compile(ProductSchemaForValidationTests);
    for (const product of products) {
      const isValid = validate(product);
      expect(
        validate.errors,
        `Продукт id=${product.id} не прошёл схему: ${JSON.stringify(validate.errors)}`,
      ).toBeNull();
      expect(isValid).toBe(true);
    }
  });
});
