import * as allure from 'allure-js-commons';
import { test, expect } from '../fixture/ProductFixture';
import Ajv from 'ajv';
import * as path from 'path';
import * as fs from 'fs';
import { ProductSchemaForProductTests } from '../factory/SchemaFactory';

const ajv = new Ajv();

test('GET всех продуктов, проверка статуса 200 и сохранение локально', async ({
  productClient,
}) => {
  await allure.epic('Products');
  await allure.feature('Список продуктов');
  await allure.severity('normal');

  const { status, body } = await productClient.getAllProducts();
  const data = (body as any).data;

  expect(status).toBe(200);
  expect((body as any).success).toBe(true);
  expect(Array.isArray(data.data)).toBe(true);
  expect(data.data.length).toBeGreaterThan(0);
  expect(typeof data.page).toBe('number');
  expect(typeof data.totalPages).toBe('number');
  expect(typeof data.totalItems).toBe('number');

  const filePath = path.join(__dirname, '../../data/products.json');
  expect(fs.existsSync(filePath)).toBe(true);
});

test.describe.serial('CRUD продуктов', () => {
  test('POST создание нового продукта', async ({ productClient }) => {
    await allure.epic('Products');
    await allure.feature('Создание продукта');
    await allure.severity('critical');

    const { status, body } = await productClient.createNewProduct();
    const data = (body as any).data;

    expect(status).toBe(201);
    expect((body as any).success).toBe(true);
    expect(typeof data._id).toBe('string');
    expect(data._id.length).toBeGreaterThan(0);
    expect(data).toMatchObject({
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
    });
    expect(data.price).toBeGreaterThanOrEqual(0);
    expect(data.stock).toBeGreaterThanOrEqual(0);

    const validate = ajv.compile(ProductSchemaForProductTests);
    const isValid = validate(data);
    expect(validate.errors, JSON.stringify(validate.errors)).toBeNull();
    expect(isValid).toBe(true);
  });

  test('GET поиск созданного продукта по ID', async ({ productClient }) => {
    await allure.epic('Products');
    await allure.feature('Получение продукта');
    await allure.severity('normal');

    await productClient.createNewProduct();
    const { status, body } = await productClient.findProduct();
    const data = (body as any).data;

    expect(status).toBe(200);
    expect(data.name).toBe(productClient.productName);
    expect(data._id).toBe(productClient.productId);
    expect(typeof data.price).toBe('number');
    expect(typeof data.stock).toBe('number');
  });

  test('PATCH обновление цены продукта', async ({ productClient }) => {
    await allure.epic('Products');
    await allure.feature('Обновление продукта');
    await allure.severity('normal');

    await productClient.createNewProduct();
    const { status, body, newPrice } = await productClient.updateProductPrice();
    const data = (body as any).data;

    expect(status).toBe(200);
    expect((body as any).success).toBe(true);
    expect(data.price).toBe(Number(newPrice));
  });

  test('DELETE удаление продукта', async ({ productClient }) => {
    await allure.epic('Products');
    await allure.feature('Удаление продукта');
    await allure.severity('normal');

    await productClient.createNewProduct();
    const { status } = await productClient.deleteProduct();

    expect([200, 204]).toContain(status);
  });

  test('GET удалённый продукт должен возвращать 404', async ({ productClient }) => {
    await allure.epic('Products');
    await allure.feature('Удаление продукта');
    await allure.severity('normal');

    await productClient.createNewProduct();
    await productClient.deleteProduct();
    const { status } = await productClient.findProduct();

    expect(status).toBe(404);
  });
});
