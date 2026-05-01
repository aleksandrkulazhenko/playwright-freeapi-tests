import { test } from '../fixture/ValidationFixture';

test('GET product by ID, валидация JSON Schema', async ({ validationClient }) => {
  await validationClient.getProductByIdValidation();
});
