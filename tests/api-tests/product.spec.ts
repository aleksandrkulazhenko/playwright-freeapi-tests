import { test } from '../fixture/ProductFixture';

test('GET всех продуктов, проверка cтатуса 200 и сохранение локально', async ({
  productClient,
}) => {
  await productClient.getAllProducts();
});

test.describe.serial('CRUD продуктов', () => {
  test('POST создание нового продукта, проверка статуса 201 и наличия id', async ({
    productClient,
  }) => {
    await productClient.createNewProduct();
  });

  test('GET поиск созданного продукта по ID и проверка имени', async ({ productClient }) => {
    await productClient.createNewProduct();
    await productClient.findProduct();
  });

  test('PATCH обновление и проверка цены продукта', async ({ productClient }) => {
    await productClient.createNewProduct();
    await productClient.updateProductPrice();
  });

  test('DELETE удаление продукта', async ({ productClient }) => {
    await productClient.createNewProduct();
    await productClient.deleteProduct();
  });
});
