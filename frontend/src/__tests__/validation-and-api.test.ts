import { validate } from '../utils/validation';
import { authApi } from '../stores/slices/api/authApi';
import { productApi } from '../stores/slices/api/productApi';

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
  it('defines the expected auth endpoints', () => {
    expect(authApi.endpoints.login).toBeDefined();
    expect(authApi.endpoints.register).toBeDefined();
  });

  it('defines the expected product endpoints', () => {
    expect(productApi.endpoints.createProduct).toBeDefined();
    expect(productApi.endpoints.getProductById).toBeDefined();
    expect(productApi.endpoints.deleteProduct).toBeDefined();
  });
});
