import * as allure from 'allure-js-commons';
import { test, expect } from '../fixture/ProductFixture';
import Ajv from 'ajv';
import * as path from 'path';
import * as fs from 'fs';

const ajv = new Ajv();

test('GET всех продуктов, проверка статуса 200 и сохранение локально', async ({
  productClient,
}) => {
  await allure.epic('Products');
  await allure.feature('Список продуктов');
  await allure.severity('normal');

  const { status, body } = await productClient.getAllProducts();

  expect(status).toBe(200);
  expect(body.success).toBe(true);
  expect(Array.isArray(body.data.data)).toBe(true);

  const filePath = path.join(__dirname, '../../data/products.json');
  expect(fs.existsSync(filePath)).toBe(true);
});

test.describe.serial('CRUD продуктов', () => {
  test('POST создание нового продукта, проверка статуса 201 и наличия id', async ({
    productClient,
  }) => {
    await allure.epic('Products');
    await allure.feature('Создание продукта');
    await allure.severity('critical');

    const { status, body } = await productClient.createNewProduct();
    const data = body.data as any;

    expect(status).toBe(201);
    expect(body.success).toBe(true);
    expect(data._id).toBeDefined();
    expect(typeof data._id).toBe('string');

    expect(data).toMatchObject({
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
      stock: expect.any(Number),
    });
  });

  test('GET поиск созданного продукта по ID и проверка имени', async ({ productClient }) => {
    await allure.epic('Products');
    await allure.feature('Получение продукта');
    await allure.severity('normal');

    await productClient.createNewProduct();
    const { status, body } = await productClient.findProduct();
    const data = body.data as any;

    expect(status).toBe(200);
    expect(data.name).toBe(productClient.productName);
    expect(data._id).toBe(productClient.productId);
  });

  test('PATCH обновление и проверка цены продукта', async ({ productClient }) => {
    await allure.epic('Products');
    await allure.feature('Обновление продукта');
    await allure.severity('normal');

    await productClient.createNewProduct();
    const { status, body, newPrice } = await productClient.updateProductPrice();

    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect((body.data as any).price.toString()).toBe(newPrice);
  });

  test('DELETE удаление продукта', async ({ productClient }) => {
    await allure.epic('Products');
    await allure.feature('Удаление продукта');
    await allure.severity('normal');

    await productClient.createNewProduct();
    const { status } = await productClient.deleteProduct();

    expect([200, 204]).toContain(status);
  });
});
