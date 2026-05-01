import { test } from '../fixture/NegativeFixture';

test.describe('Поиск багов', () => {
  test('GET продукт с невалидным ID (404)', async ({ negativeClient }) => {
    await negativeClient.getProductWithInvalidId();
  });

  test('POST создание продукта без токена (401)', async ({ negativeClient }) => {
    await negativeClient.createProductWithoutToken();
  });

  test('POST создание продукта с невалидной ценой (400)', async ({ negativeClient }) => {
    await negativeClient.createProductWithInvalidPrice();
  });
});
