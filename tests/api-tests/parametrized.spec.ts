import { test } from '../fixture/ParametrizedFixture';

test(`POST проверка создания продукта`, async ({ parametrizedClient }) => {
  await parametrizedClient.createProduct();
});
