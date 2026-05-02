import { APIRequestContext } from '@playwright/test';
import { ProductFactory } from '../factory/ProductFactory';

export class NegativeClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getProductWithInvalidId() {
    const response = await this.request.get('/api/v1/ecommerce/products/999999999900000000001234');
    const body = await response.json();
    return { status: response.status(), body };
  }

  async createProductWithoutToken() {
    const productData = ProductFactory.build();

    const response = await this.request.post('/api/v1/ecommerce/products', {
      multipart: productData,
      headers: {
        Authorization: '',
      },
    });
    const body = await response.json();
    return { status: response.status(), body };
  }

  async createProductWithInvalidPrice() {
    const productData = ProductFactory.build();
    productData.price = 'сто';

    const response = await this.request.post('/api/v1/ecommerce/products', {
      multipart: productData,
    });
    const body = await response.json();
    return { status: response.status(), body };
  }
}
