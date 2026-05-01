import { APIRequestContext, expect } from '@playwright/test';
import { productSchema } from '../factory/SchemaFactory';
import Ajv from 'ajv';

export class ValidationClient {
  readonly request: APIRequestContext;
  ajv = new Ajv();

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async getProductByIdValidation() {
    const listResponse = await this.request.get(
      'https://api.freeapi.app/api/v1/public/randomproducts',
    );
    expect(listResponse.status()).toBe(200);

    const listBody = await listResponse.json();
    const products = listBody.data.data;

    expect(products.length, 'Список продуктов пуст').toBeGreaterThan(0);

    const productId = products[0].id;

    const response = await this.request.get(
      `https://api.freeapi.app/api/v1/public/randomproducts/${productId}`,
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    const validate = this.ajv.compile(productSchema);
    const isValid = validate(body.data);

    expect(validate.errors).toBeNull();
    expect(isValid).toBe(true);
  }
}
