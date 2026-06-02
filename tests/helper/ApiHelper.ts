import { APIRequestContext } from '@playwright/test';

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
}

const MAX_RETRIES = 2;
const RETRY_STATUS = [429, 500, 502, 503, 504];
const TIMEOUT = 10000;

async function withRetry<T>(fun: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fun();
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

async function parseBody<T>(response: Awaited<ReturnType<APIRequestContext['get']>>): Promise<T> {
  try {
    return response.json();
  } catch {
    return null as unknown as T;
  }
}

export async function getMethod<T = unknown>(
  request: APIRequestContext,
  url: string,
  options: Parameters<APIRequestContext['get']>[1] = {},
): Promise<ApiResponse<T>> {
  return withRetry(async () => {
    const response = await request.get(url, { timeout: TIMEOUT, ...options });
    const body = await parseBody<T>(response);
    if (RETRY_STATUS.includes(response.status())) {
      throw new Error(`Retryable status ${response.status} on GET ${url}`);
    }
    return { status: response.status(), body };
  });
}

export async function postMethod<T = unknown>(
  request: APIRequestContext,
  url: string,
  options: Parameters<APIRequestContext['post']>[1] = {},
): Promise<ApiResponse<T>> {
  return withRetry(async () => {
    const response = await request.post(url, { timeout: TIMEOUT, ...options });
    const body = await parseBody<T>(response);
    if (RETRY_STATUS.includes(response.status())) {
      throw new Error(`Retryable status ${response.status} on POST ${url}`);
    }
    return { status: response.status(), body };
  });
}

export async function putMethod<T = unknown>(
  request: APIRequestContext,
  url: string,
  options: Parameters<APIRequestContext['put']>[1] = {},
): Promise<ApiResponse<T>> {
  return withRetry(async () => {
    const response = await request.put(url, { timeout: TIMEOUT, ...options });
    const body = await parseBody<T>(response);
    if (RETRY_STATUS.includes(response.status())) {
      throw new Error(`Retryable status ${response.status} on put ${url}`);
    }
    return { status: response.status(), body };
  });
}

export async function patchMethod<T = unknown>(
  request: APIRequestContext,
  url: string,
  options: Parameters<APIRequestContext['patch']>[1] = {},
): Promise<ApiResponse<T>> {
  return withRetry(async () => {
    const response = await request.patch(url, { timeout: TIMEOUT, ...options });
    const body = await parseBody<T>(response);
    if (RETRY_STATUS.includes(response.status())) {
      throw new Error(`Retryable status ${response.status} on PATCH ${url}`);
    }
    return { status: response.status(), body };
  });
}

export async function deleteMethod<T = unknown>(
  request: APIRequestContext,
  url: string,
  options: Parameters<APIRequestContext['delete']>[1] = {},
): Promise<ApiResponse<T>> {
  return withRetry(async () => {
    const response = await request.delete(url, { timeout: TIMEOUT, ...options });
    const body = await parseBody<T>(response);
    if (RETRY_STATUS.includes(response.status())) {
      throw new Error(`Retryable status ${response.status} on DELETE ${url}`);
    }
    return { status: response.status(), body };
  });
}
