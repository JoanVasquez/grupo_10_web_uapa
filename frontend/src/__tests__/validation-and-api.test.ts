import { validate } from '../utils/validation';
import { afterEach, beforeEach, vi } from 'vitest';

vi.mock('../utils/constants', () => ({
  BASE_API: 'http://localhost:3000',
}));

import { authApi } from '../stores/slices/api/authApi';
import { productApi } from '../stores/slices/api/productApi';
import { configureStore } from '@reduxjs/toolkit';

describe('validation helper', () => {
  const config = [
    { id: 'name', label: 'Name', required: true, minLength: 2, maxLength: 5 },
    { id: 'price', label: 'Price', type: 'number' as const, min: 2 },
  ];

  it('validates required, min and max length constraints', () => {
    expect(validate('name', '', config)).toBe('Este campo es obligatorio');
    expect(validate('name', 'A', config)).toBe('Mínimo 2 caracteres');
    expect(validate('name', '123456', config)).toBe('Máximo 5 caracteres');
    expect(validate('name', 'John', config)).toBeUndefined();
  });

  it('validates numeric minimums', () => {
    expect(validate('price', 1, config)).toBe('Mínimo 2');
    expect(validate('price', 4, config)).toBeUndefined();
  });
});

describe('api slices', () => {
  const createTestStore = () =>
    configureStore({
      reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, productApi.middleware),
    });

  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) =>
      key === 'token' ? 'test-token' : null,
    );
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () =>
        new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defines the expected auth endpoints', () => {
    expect(authApi.endpoints.login).toBeDefined();
    expect(authApi.endpoints.register).toBeDefined();
  });

  it('defines the expected product endpoints', () => {
    expect(productApi.endpoints.createProduct).toBeDefined();
    expect(productApi.endpoints.getProductById).toBeDefined();
    expect(productApi.endpoints.deleteProduct).toBeDefined();
  });

  it('executes auth endpoint queries and attaches bearer token headers', async () => {
    const store = createTestStore();

    await store.dispatch(
      authApi.endpoints.register.initiate({
        username: 'tester',
        email: 'tester@mail.com',
        password: 'secret',
      }),
    );
    await store.dispatch(
      authApi.endpoints.login.initiate({
        email: 'tester@mail.com',
        password: 'secret',
      }),
    );
    await store.dispatch(authApi.endpoints.logout.initiate());

    const authCalls = vi.mocked(fetch).mock.calls.map(([request]) => request as Request);
    expect(authCalls[0]?.url).toContain('/api/auth/register');
    expect(authCalls[0]?.method).toBe('POST');
    expect(authCalls[0]?.headers.get('authorization')).toBe('Bearer test-token');
    expect(authCalls[1]?.url).toContain('/api/auth/login');
    expect(authCalls[1]?.method).toBe('POST');
    expect(authCalls[2]?.url).toContain('/api/auth/logout');
    expect(authCalls[2]?.method).toBe('GET');
  });

  it('executes product endpoint queries and mutations', async () => {
    const store = createTestStore();

    await store.dispatch(
      productApi.endpoints.createProduct.initiate({
        code: 'A1',
        name: 'Keyboard',
        description: 'Mechanical keyboard',
        price: 59.99,
        category: 'Accessories',
        brand: 'KeyBrand',
        model: 'K100',
        stock: 5,
      }),
    );

    await store.dispatch(
      productApi.endpoints.updateProduct.initiate({
        id: 'product-1',
        code: 'A1',
        name: 'Keyboard Pro',
        description: 'Mechanical keyboard',
        price: 79.99,
        category: 'Accessories',
        brand: 'KeyBrand',
        model: 'K200',
        stock: 4,
      }),
    );

    await store.dispatch(productApi.endpoints.getProduct.initiate());
    await store.dispatch(productApi.endpoints.getProductById.initiate('product-1'));
    await store.dispatch(productApi.endpoints.deleteProduct.initiate('product-1'));

    const productCalls = vi.mocked(fetch).mock.calls.map(([request]) => request as Request);
    expect(productCalls[1]?.url).toContain('/api/product/product-1');
    expect(productCalls[1]?.method).toBe('PUT');
    expect(productCalls[2]?.url).toContain('/api/product?page=1&per_page=10');
    expect(productCalls[2]?.method).toBe('GET');
    expect(productCalls[4]?.url).toContain('/api/product/product-1');
    expect(productCalls[4]?.method).toBe('DELETE');
  });
});
