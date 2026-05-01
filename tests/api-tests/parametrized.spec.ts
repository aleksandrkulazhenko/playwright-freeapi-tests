import { test } from '../fixture/parametrizedClient';

test(`POST проверка создания продукта`, async ({ parametrizedClient }) => {
  await parametrizedClient.createProduct();
});
