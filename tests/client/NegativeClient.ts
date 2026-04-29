import { APIRequestContext } from '@playwright/test';

export class NegativeClient {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
}
