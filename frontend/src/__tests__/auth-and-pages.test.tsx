import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import RegisterProductsPage from '../pages/RegisterUpdateProductsPage';
import { authApi } from '../stores/slices/api/authApi';
import { productApi } from '../stores/slices/api/productApi';

const registerMock = vi.fn();
const createProductMock = vi.fn();
const navigateMock = vi.fn();

vi.mock('../stores/slices/api/authApi', async () => {
  const actual = await vi.importActual<typeof import('../stores/slices/api/authApi')>('../stores/slices/api/authApi');
  return {
    ...actual,
    useRegisterMutation: () => [registerMock],
    useLoginMutation: () => [vi.fn()],
    authApi: actual.authApi,
  };
});

vi.mock('../stores/slices/api/productApi', async () => {
  const actual = await vi.importActual<typeof import('../stores/slices/api/productApi')>('../stores/slices/api/productApi');
  return {
    ...actual,
    useCreateProductMutation: () => [createProductMock],
    productApi: actual.productApi,
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const buildStore = () =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware, productApi.middleware),
  });

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <Provider store={buildStore()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );

describe('auth and page flows', () => {
  beforeEach(() => {
    localStorage.clear();
    registerMock.mockReset();
    createProductMock.mockReset();
    navigateMock.mockReset();
  });

  it('switches auth page between sign in and sign up modes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuthPage />);

    expect(screen.getAllByRole('button', { name: /sign in/i }).length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: /^sign up$/i }));
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows a success message after creating a product', async () => {
    const user = userEvent.setup();
    createProductMock.mockReturnValue({
      unwrap: () => Promise.resolve({ _statusCode: 201, _status: 'CREATED', _timeStamp: 'now', _data: null }),
    });

    renderWithProviders(<RegisterProductsPage />);

    await user.type(screen.getByLabelText('Código'), 'ABC');
    await user.type(screen.getByLabelText('Nombre'), 'Tablet');
    await user.type(screen.getByLabelText('Precio'), '10');
    await user.type(screen.getByLabelText('Categoría'), 'Audio');
    await user.type(screen.getByLabelText('Marca'), 'Sony');
    await user.type(screen.getByLabelText('Modelo'), 'X1');
    await user.type(screen.getByLabelText('Stock'), '3');
    await user.click(screen.getByRole('button', { name: /guardar producto/i }));

    expect(await screen.findByText('Producto registrado correctamente.')).toBeInTheDocument();
  });

  it('redirects to login when product creation reports an expired token', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'expired');
    createProductMock.mockReturnValue({
      unwrap: () => Promise.reject({ status: 403, data: { _message: 'expired token' } }),
    });

    renderWithProviders(<RegisterProductsPage />);

    await user.type(screen.getByLabelText('Código'), 'ABC');
    await user.type(screen.getByLabelText('Nombre'), 'Tablet');
    await user.type(screen.getByLabelText('Precio'), '10');
    await user.type(screen.getByLabelText('Categoría'), 'Audio');
    await user.type(screen.getByLabelText('Marca'), 'Sony');
    await user.type(screen.getByLabelText('Modelo'), 'X1');
    await user.type(screen.getByLabelText('Stock'), '3');
    await user.click(screen.getByRole('button', { name: /guardar producto/i }));

    expect(localStorage.getItem('token')).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith('/', { replace: true });
  });

  it('shows a fallback error when product creation fails for another reason', async () => {
    const user = userEvent.setup();
    createProductMock.mockReturnValue({
      unwrap: () => Promise.reject({ status: 500, data: {} }),
    });

    renderWithProviders(<RegisterProductsPage />);

    await user.type(screen.getByLabelText('Código'), 'ABC');
    await user.type(screen.getByLabelText('Nombre'), 'Tablet');
    await user.type(screen.getByLabelText('Precio'), '10');
    await user.type(screen.getByLabelText('Categoría'), 'Audio');
    await user.type(screen.getByLabelText('Marca'), 'Sony');
    await user.type(screen.getByLabelText('Modelo'), 'X1');
    await user.type(screen.getByLabelText('Stock'), '3');
    await user.click(screen.getByRole('button', { name: /guardar producto/i }));

    expect(await screen.findByText('No se pudo registrar el producto.')).toBeInTheDocument();
  });

  it('clears the form when reset is requested after editing a field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterProductsPage />);

    const codeInput = screen.getByLabelText('Código') as HTMLInputElement;
    await user.type(codeInput, 'ABC');
    expect(codeInput.value).toBe('ABC');

    await user.click(screen.getByRole('button', { name: /limpiar/i }));
    expect(codeInput.value).toBe('');
  });
});
