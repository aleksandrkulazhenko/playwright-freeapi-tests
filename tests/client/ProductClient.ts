import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import * as fs from 'fs';
import { faker } from '@faker-js/faker';
import * as path from 'path';

interface Product {
  [key: string]: string | number | boolean | { name: string; mimeType: string; buffer: Buffer };
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  mainImage: {
    name: string;
    mimeType: string;
    buffer: Buffer;
  };
}

export class ProductClient {
  readonly request: APIRequestContext;
  readonly newProduct: Product;
  productId: string = '';
  productName: string = '';

  constructor(request: APIRequestContext) {
    this.request = request;
    this.newProduct = {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.int({ min: 10, max: 9999 }).toString(),
      stock: faker.number.int({ min: 1, max: 100 }).toString(),
      category: process.env.CATEGORY_ID || 'default_category',
      mainImage: {
        name: 'icon.png',
        mimeType: 'image/png',
        buffer: fs.readFileSync(path.join(__dirname, '../../data/icon.png')),
      },
    };
  }

  async getAllProducts() {
    const response = await this.request.get(
      'https://api.freeapi.app/api/v1/public/randomproducts?page=1&limit=10&inc=category%252Cprice%252Cthumbnail%252Cimages%252Ctitle%252Cid&query=mens-watches',
    );
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data.data)).toBe(true);

    fs.writeFileSync(
      path.join(__dirname, '../../data/products.json'),
      JSON.stringify(body, null, 2),
    );
  }

  async createNewProduct() {
    const response: APIResponse = await this.request.post(
      'https://api.freeapi.app/api/v1/ecommerce/products',
      {
        multipart: this.newProduct,
      },
    );

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body.data._id).toBeDefined();

    this.productId = body.data._id;
    this.productName = body.data.name;
  }

  async findProduct() {
    await this.createNewProduct();
    const response = await this.request.get(
      `https://api.freeapi.app/api/v1/ecommerce/products/${this.productId}`,
    );

    expect(response.ok()).toBeTruthy();
    const body = await response.json();

    expect(body.data.name).toBe(this.productName);
  }

  async updateProductPrice() {
    await this.createNewProduct();
    const newPrice = faker.number.int({ min: 10, max: 9999 }).toString();

    const response = await this.request.patch(
      `https://api.freeapi.app/api/v1/ecommerce/products/${this.productId}`,
      {
        data: {
          price: newPrice,
          category: process.env.CATEGORY_ID,
        },
      },
    );

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.data.price.toString()).toBe(newPrice);
  }

  async deleteProduct() {
    await this.createNewProduct();
    const response = await this.request.delete(
      `https://api.freeapi.app/api/v1/ecommerce/products/${this.productId}`,
    );

    expect([200, 204]).toContain(response.status());
  }
}
