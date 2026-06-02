import { APIRequestContext } from '@playwright/test';
import { ProductFactory } from '../factory/ProductFactory';
import { getMethod, postMethod } from '../helper/ApiHelper';

export class NegativeClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getProductWithInvalidId() {
    return getMethod(this.request, '/api/v1/ecommerce/products/999999999900000000001234');
  }

  async createProductWithoutToken() {
    const productData = ProductFactory.build();
    return postMethod(this.request, '/api/v1/ecommerce/products', {
      multipart: productData,
      headers: { Authorization: '' },
    });
  }

  async createProductWithInvalidPrice() {
    const productData = ProductFactory.build();
    productData.price = 'сто';
    return postMethod(this.request, '/api/v1/ecommerce/products', {
      multipart: productData,
    });
  }

  async createProductWithMissingName() {
    const productData = ProductFactory.build();
    const { name: _omit, ...withoutName } = productData as any;
    return postMethod(this.request, '/api/v1/ecommerce/products', {
      multipart: withoutName,
    });
  }

  async createProductWithInvalidToken() {
    const productData = ProductFactory.build();
    return postMethod(this.request, '/api/v1/ecommerce/products', {
      multipart: productData,
      headers: { Authorization: 'Bearer invalidToken' },
    });
  }
}
