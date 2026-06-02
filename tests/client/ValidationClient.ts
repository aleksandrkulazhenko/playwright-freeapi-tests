import { APIRequestContext } from '@playwright/test';
import { getMethod } from '../helper/ApiHelper';

export class ValidationClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getRandomProducts() {
    return getMethod(this.request, '/api/v1/public/randomproducts');
  }

  async getProductById(productId: number) {
    return getMethod(this.request, `/api/v1/public/randomproducts/${productId}`);
  }
}
