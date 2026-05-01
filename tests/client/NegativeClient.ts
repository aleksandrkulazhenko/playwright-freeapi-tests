import { APIRequestContext, expect } from '@playwright/test';
import { ProductFactory } from '../factory/ProductFactory';

export class NegativeClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getProductWithInvalidId() {
    const response = await this.request.get(
      'https://api.freeapi.app/api/v1/ecommerce/products/999999999900000000001234',
    );

    expect(response.status()).toBe(404);
  }

  async createProductWithoutToken() {
    const productData = ProductFactory.build();

    const response = await this.request.post('https://api.freeapi.app/api/v1/ecommerce/products', {
      multipart: productData,
      headers: {
        Authorization: '',
      },
    });

    expect(response.status()).toBe(401);
  }

  async createProductWithInvalidPrice() {
    let productData = ProductFactory.build();
    productData.price = 'сто';
    const response = await this.request.post('https://api.freeapi.app/api/v1/ecommerce/products', {
      multipart: productData,
    });

    expect(response.status()).toBe(422);
  }
}
