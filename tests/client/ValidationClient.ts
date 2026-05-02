import { APIRequestContext } from '@playwright/test';

export class ValidationClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getRandomProducts() {
    const response = await this.request.get('/api/v1/public/randomproducts');
    const body = await response.json();
    return { status: response.status(), body };
  }

  async getProductById(productId: number) {
    const response = await this.request.get(`/api/v1/public/randomproducts/${productId}`);
    const body = await response.json();
    return { status: response.status(), body };
  }
}
