import { APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProductFactory, Product } from '../factory/ProductFactory';
import { deleteMethod, getMethod, patchMethod, postMethod } from '../helper/ApiHelper';

export class ProductClient {
  readonly request: APIRequestContext;
  readonly newProduct: Product;
  productId: string = '';
  productName: string = '';
  private createdIDs: string[] = [];

  constructor(request: APIRequestContext) {
    this.request = request;
    this.newProduct = ProductFactory.build();
  }

  async getAllProducts() {
    const result = await getMethod<any>(this.request, '/api/v1/public/randomproducts');
    fs.writeFileSync(
      path.join(__dirname, '../../data/products.json'),
      JSON.stringify(result.body, null, 2),
    );

    return result;
  }

  async createNewProduct() {
    const result = await postMethod<any>(this.request, '/api/v1/ecommerce/products', {
      multipart: this.newProduct,
    });

    if (result.body?.data?._id) {
      this.productId = result.body.data._id;
      this.productName = result.body.data.name;
      this.createdIDs.push(this.productId);
    }

    return result;
  }

  async findProduct() {
    return getMethod(this.request, `/api/v1/ecommerce/products/${this.productId}`);
  }

  async updateProductPrice() {
    const newPrice = faker.number.int({ min: 10, max: 9999 }).toString();
    const result = await patchMethod<any>(
      this.request,
      `/api/v1/ecommerce/products/${this.productId}`,
      {
        data: {
          price: newPrice,
          category: process.env.CATEGORY_ID,
        },
      },
    );

    return { ...result, newPrice };
  }

  async deleteProduct() {
    return deleteMethod(this.request, `/api/v1/ecommerce/products/${this.productId}`);
  }

  async cleanup() {
    for (const id of this.createdIDs) {
      try {
        await deleteMethod(this.request, `/api/v1/ecommerce/products/${id}`);
      } catch {}
    }
    this.createdIDs = [];
  }
}
