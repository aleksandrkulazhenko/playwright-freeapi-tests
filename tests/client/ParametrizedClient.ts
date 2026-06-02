import { APIRequestContext } from '@playwright/test';
import { ProductFactory } from '../factory/ProductFactory';
import { postMethod } from '../helper/ApiHelper';

export class ParametrizedClient {
  readonly request: APIRequestContext;
  priceCases = [
    { price: '0', label: 'нулевая цена' },
    { price: '999999999', label: 'очень большое число' },
    { price: '-1', label: 'отрицательное число' },
  ];

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createProductWithPrice(price: string) {
    const product = ProductFactory.build();
    product.price = price;

    const result = await postMethod<any>(this.request, '/api/v1/ecommerce/products', {
      multipart: product,
    });
    return { ...result, price };
  }
}
