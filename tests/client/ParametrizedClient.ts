import test, { APIRequestContext, expect } from '@playwright/test';
import { ProductFactory } from '../factory/ProductFactory';

export class ParametrizedClient {
  readonly request: APIRequestContext;
  priceCases = [{ price: '0' }, { price: '999999999' }, { price: '-1' }];
  product = ProductFactory.build();

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createProduct() {
    for (const { price } of this.priceCases) {
      await test.step(`POST проверка создания продукта с ценой: ${price}`, async () => {
        this.product.price = price;
        const response = await this.request.post(
          'https://api.freeapi.app/api/v1/ecommerce/products',
          {
            multipart: this.product,
          },
        );

        expect([200, 201, 400, 422]).toContain(response.status());
      });
    }
  }
}
