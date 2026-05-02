import { APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProductFactory, Product } from '../factory/ProductFactory';

export class ProductClient {
  readonly request: APIRequestContext;
  readonly newProduct: Product;
  productId: string = '';
  productName: string = '';

  constructor(request: APIRequestContext) {
    this.request = request;
    this.newProduct = ProductFactory.build();
  }

  async getAllProducts() {
    const response = await this.request.get('/api/v1/public/randomproducts');
    const body = await response.json();
    fs.writeFileSync(
      path.join(__dirname, '../../data/products.json'),
      JSON.stringify(body, null, 2),
    );

    return { status: response.status(), body };
  }

  async createNewProduct() {
    const response = await this.request.post('/api/v1/ecommerce/products', {
      multipart: this.newProduct,
    });
    const body = await response.json();

    if (body?.data?._id) {
      this.productId = body.data._id;
      this.productName = body.data.name;
    }

    return { status: response.status(), body };
  }

  async findProduct() {
    const response = await this.request.get(`/api/v1/ecommerce/products/${this.productId}`);
    const body = await response.json();
    return { status: response.status(), body };
  }

  async updateProductPrice() {
    const newPrice = faker.number.int({ min: 10, max: 9999 }).toString();

    const response = await this.request.patch(`/api/v1/ecommerce/products/${this.productId}`, {
      data: {
        price: newPrice,
        category: process.env.CATEGORY_ID,
      },
    });
    const body = await response.json();
    return { status: response.status(), body, newPrice };
  }

  async deleteProduct() {
    const response = await this.request.delete(`/api/v1/ecommerce/products/${this.productId}`);
    return { status: response.status() };
  }
}
