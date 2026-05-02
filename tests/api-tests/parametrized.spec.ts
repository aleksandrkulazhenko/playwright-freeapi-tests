import * as allure from 'allure-js-commons';
import { test, expect } from '../fixture/ParametrizedFixture';

const priceCases = [
  { price: '0', label: 'нулевая цена' },
  { price: '999999999', label: 'очень большое число' },
  { price: '-1', label: 'отрицательное число' },
];

test.describe('Параметризованные тесты — граничные значения цены', () => {
  for (const { price, label } of priceCases) {
    test(`POST создание продукта: ${label} (${price})`, async ({ parametrizedClient }) => {
      await allure.epic('Advanced');
      await allure.feature('Параметризованные тесты');
      await allure.severity('minor');
      await allure.parameter('price', price);

      const { status, body } = await parametrizedClient.createProductWithPrice(price);

      expect([200, 201, 400, 422]).toContain(status);

      if (status === 200 || status === 201) {
        expect(body.success).toBe(true);
      } else {
        expect(body.success).toBe(false);
      }
    });
  }
});
