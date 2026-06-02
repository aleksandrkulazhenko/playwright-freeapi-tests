import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

export interface Product {
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

export class ProductBuilder {
  private data: Product = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.int({ min: 10, max: 9999 }).toString(),
    stock: faker.number.int({ min: 1, max: 100 }).toString(),
    category: process.env.CATEGORY_ID!,
    mainImage: {
      name: 'icon.png',
      mimeType: 'image/png',
      buffer: fs.readFileSync(path.join(__dirname, '../../data/icon.png')),
    },
  };

  withName(name: string): this {
    this.data.name = name;
    return this;
  }

  withDescription(description: string): this {
    this.data.description = description;
    return this;
  }

  withPrice(price: string): this {
    this.data.price = price;
    return this;
  }

  withStock(stock: string): this {
    this.data.stock = stock;
    return this;
  }

  withCategory(category: string): this {
    this.data.category = category;
    return this;
  }

  build(): Product {
    return { ...this.data };
  }
}

export const ProductFactory = {
  build: (): Product => new ProductBuilder().build(),
};
