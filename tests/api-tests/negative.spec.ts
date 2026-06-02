import * as allure from 'allure-js-commons';
import { test, expect } from '../fixture/NegativeFixture';

test.describe('Поиск багов — негативные сценарии', () => {
  test('GET продукт с невалидным ID (404)', async ({ negativeClient }) => {
    await allure.epic('Negative');
    await allure.feature('Несуществующий ресурс');
    await allure.severity('normal');

    const { status, body } = await negativeClient.getProductWithInvalidId();

    expect(status).toBe(404);
    expect((body as any).success).toBe(false);
    expect((body as any).message).toBeDefined();
  });

  test('POST создание продукта без токена (401)', async ({ negativeClient }) => {
    await allure.epic('Negative');
    await allure.feature('Защищённые эндпоинты');
    await allure.severity('critical');

    const { status, body } = await negativeClient.createProductWithoutToken();

    expect(status).toBe(401);
    expect((body as any).success).toBe(false);
    expect((body as any).message).toBeDefined();
  });

  test('POST создание продукта с невалидным токеном (401)', async ({ negativeClient }) => {
    await allure.epic('Negative');
    await allure.feature('Защищённые эндпоинты');
    await allure.severity('critical');

    const { status, body } = await negativeClient.createProductWithInvalidToken();

    expect(status).toBe(401);
    expect((body as any).success).toBe(false);
  });

  test('POST создание продукта с невалидной ценой (400)', async ({ negativeClient }) => {
    await allure.epic('Negative');
    await allure.feature('Нарушение схемы данных');
    await allure.severity('normal');

    const { status, body } = await negativeClient.createProductWithInvalidPrice();

    expect([400, 422]).toContain(status);
    expect((body as any).success).toBe(false);
  });

  test('POST создание продукта без обязательного поля name (400)', async ({ negativeClient }) => {
    await allure.epic('Negative');
    await allure.feature('Обязательные поля');
    await allure.severity('normal');

    const { status, body } = await negativeClient.createProductWithMissingName();

    expect([400, 422]).toContain(status);
    expect((body as any).success).toBe(false);
  });
});
