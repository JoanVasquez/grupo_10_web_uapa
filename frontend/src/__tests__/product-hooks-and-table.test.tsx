import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useProductForm } from '../hooks/useProductForm';
import { useProductsTable } from '../hooks/useProductsTable';
import DynamicDataTable from '../components/features/DynamicDataTable/DynamicDataTable';
import Alert from '../components/common/Alert/Alert';
import Card from '../components/common/Card/Card';
import FormError from '../components/common/Form/FormError';

const navigateMock = vi.fn();
const createProductMock = vi.fn();
const updateProductMock = vi.fn();
const getProductByIdQueryMock = vi.fn();
const getProductQueryMock = vi.fn();
const deleteProductMock = vi.fn();
const refetchMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../stores/slices/api/productApi', async () => {
  const actual = await vi.importActual<typeof import('../stores/slices/api/productApi')>('../stores/slices/api/productApi');
  return {
    ...actual,
    useCreateProductMutation: () => [createProductMock],
    useUpdateProductMutation: () => [updateProductMock],
    useGetProductByIdQuery: (...args: unknown[]) => getProductByIdQueryMock(...args),
    useGetProductQuery: () => getProductQueryMock(),
    useDeleteProductMutation: () => [deleteProductMock],
  };
});

type ProductFormHarnessProps = {
  submitValues?: Record<string, string>;
};

const ProductFormHarness = ({ submitValues }: ProductFormHarnessProps) => {
  const { values, errors, pageTitle, isEditing, isLoadingProduct, submitError, submitSuccess, handleChange, handleReset, handleSubmit } =
    useProductForm();

  return (
    <div>
      <span data-testid="page-title">{pageTitle}</span>
      <span data-testid="editing">{String(isEditing)}</span>
      <span data-testid="loading">{String(isLoadingProduct)}</span>
      <span data-testid="success">{submitSuccess}</span>
      <span data-testid="submit-error">{submitError}</span>
      <span data-testid="name-value">{values.name}</span>
      <span data-testid="stock-error">{errors.stock ?? ''}</span>
      <button type="button" onClick={() => handleChange('name', 'Laptop')}>change-name</button>
      <button type="button" onClick={() => handleChange('stock', 1)}>change-stock</button>
      <button
        type="button"
        onClick={() => {
          if (!submitValues) return;
          for (const [key, value] of Object.entries(submitValues)) {
            handleChange(key as never, value as never);
          }
        }}
      >
        fill-valid-values
      </button>
      <button type="button" onClick={handleReset}>reset</button>
      <form
        aria-label="product-form-harness"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

const ProductsTableHarness = () => {
  const { columns, feedback, handleDelete, handleEdit, isLoading, products } = useProductsTable();

  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="feedback">{feedback ? `${feedback.type}:${feedback.message}` : ''}</span>
      <span data-testid="product-count">{String(products.length)}</span>
      <span data-testid="price-preview">{columns[4].render?.(products[0] ?? { price: 0 })}</span>
      <button type="button" onClick={() => handleEdit(products[0] ?? { code: 'X', name: 'Fallback', price: 0, description: '', category: '', brand: '', model: '', stock: 0 })}>
        edit-first
      </button>
      <button type="button" onClick={() => handleDelete(products[0] ?? { code: 'X', name: 'Fallback', price: 0, description: '', category: '', brand: '', model: '', stock: 0 })}>
        delete-first
      </button>
    </div>
  );
};

describe('product hooks and table utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    navigateMock.mockReset();
    createProductMock.mockReset();
    updateProductMock.mockReset();
    getProductByIdQueryMock.mockReset();
    getProductQueryMock.mockReset();
    deleteProductMock.mockReset();
    refetchMock.mockReset();

    getProductByIdQueryMock.mockReturnValue({ data: undefined, isLoading: false });
    getProductQueryMock.mockReturnValue({ data: undefined, isLoading: false, refetch: refetchMock });
  });

  it('handles create flow, validation, and reset in useProductForm', async () => {
    const user = userEvent.setup();
    createProductMock.mockReturnValue({
      unwrap: () => Promise.resolve({ _statusCode: 201, _status: 'CREATED', _timeStamp: 'now', _data: null }),
    });

    render(
      <MemoryRouter>
        <ProductFormHarness
          submitValues={{
            code: 'ABC',
            name: 'Laptop',
            price: '120',
            description: 'Equipo',
            category: 'Audio',
            brand: 'Sony',
            model: 'X1',
            stock: '4',
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('Registrar productos');

    await user.click(screen.getByRole('button', { name: 'change-stock' }));
    expect(screen.getByTestId('stock-error').textContent).not.toBe('');

    await user.click(screen.getByRole('button', { name: 'change-name' }));
    expect(screen.getByTestId('name-value')).toHaveTextContent('Laptop');

    await user.click(screen.getByRole('button', { name: 'reset' }));
    expect(screen.getByTestId('name-value')).toHaveTextContent('');

    await user.click(screen.getByRole('button', { name: 'fill-valid-values' }));
    fireEvent.submit(screen.getByRole('form', { name: 'product-form-harness' }));

    await waitFor(() => expect(createProductMock).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByTestId('success')).toHaveTextContent('Producto registrado correctamente.'));
  });

  it('loads an existing product, updates it, and redirects on expired token errors', async () => {
    const user = userEvent.setup();
    getProductByIdQueryMock.mockReturnValue({
      data: {
        _statusCode: 200,
        _status: 'OK',
        _timeStamp: 'now',
        _data: { id: '1', code: 'ABC', name: 'Tablet', price: 10, description: '', category: 'Audio', brand: 'Sony', model: 'X1', stock: 3 },
      },
      isLoading: false,
    });
    updateProductMock.mockReturnValueOnce({
      unwrap: () => Promise.resolve({ _statusCode: 200, _status: 'OK', _timeStamp: 'now', _data: null }),
    });
    updateProductMock.mockReturnValueOnce({
      unwrap: () => Promise.reject({ status: 403, data: { _message: 'expired token' } }),
    });
    localStorage.setItem('token', 'token');

    render(
      <MemoryRouter initialEntries={['/dashboard/form/1']}>
        <Routes>
          <Route path="/dashboard/form/:id" element={<ProductFormHarness submitValues={{ code: 'ABC', name: 'Tablet', price: '10', description: '', category: 'Audio', brand: 'Sony', model: 'X1', stock: '3' }} />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByTestId('editing')).toHaveTextContent('true'));
    await waitFor(() => expect(screen.getByTestId('name-value')).toHaveTextContent('Tablet'));

    await user.click(screen.getByRole('button', { name: 'fill-valid-values' }));
    fireEvent.submit(screen.getByRole('form', { name: 'product-form-harness' }));
    await waitFor(() => expect(updateProductMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('success')).toHaveTextContent('Producto actualizado correctamente.'));

    await user.click(screen.getByRole('button', { name: 'fill-valid-values' }));
    fireEvent.submit(screen.getByRole('form', { name: 'product-form-harness' }));
    await waitFor(() => expect(updateProductMock).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/', { replace: true }));
    expect(localStorage.getItem('token')).toBeNull();
    expect(screen.getByTestId('submit-error')).toHaveTextContent('');

    await user.click(screen.getByRole('button', { name: 'reset' }));
    expect(screen.getByTestId('name-value')).toHaveTextContent('');
  });

  it('normalizes product collections and handles edit/delete feedback in useProductsTable', async () => {
    const user = userEvent.setup();
    getProductQueryMock.mockReturnValue({
      data: {
        _statusCode: 200,
        _status: 'OK',
        _timeStamp: 'now',
        _data: {
          items: [{ id: '1', code: 'ABC', name: 'Tablet', price: 10, description: '', category: 'Audio', brand: 'Sony', model: 'X1', stock: 3 }],
          total: 1,
        },
      },
      isLoading: true,
      refetch: refetchMock,
    });
    deleteProductMock.mockReturnValueOnce({
      unwrap: () => Promise.resolve({ _statusCode: 200, _status: 'OK', _timeStamp: 'now', _message: 'Producto eliminado.', _data: null }),
    });
    deleteProductMock.mockReturnValueOnce({
      unwrap: () => Promise.reject({ status: 500, data: {} }),
    });

    render(
      <MemoryRouter>
        <ProductsTableHarness />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('product-count')).toHaveTextContent('1');
    expect(screen.getByTestId('price-preview')).toHaveTextContent('$10.00');

    await user.click(screen.getByRole('button', { name: 'edit-first' }));
    expect(navigateMock).toHaveBeenCalledWith('/dashboard/form/1');

    await user.click(screen.getByRole('button', { name: 'delete-first' }));
    await waitFor(() => expect(refetchMock).toHaveBeenCalled());
    expect(screen.getByTestId('feedback')).toHaveTextContent('success:Producto eliminado.');

    await user.click(screen.getByRole('button', { name: 'delete-first' }));
    await waitFor(() => expect(screen.getByTestId('feedback')).toHaveTextContent('error:No se pudo eliminar el producto.'));
  });

  it('returns errors when trying to edit or delete a product without an id', async () => {
    const user = userEvent.setup();
    getProductQueryMock.mockReturnValue({
      data: [{ _statusCode: 200, _status: 'OK', _timeStamp: 'now', _data: { code: 'ABC', name: 'Tablet', price: 10, description: '', category: 'Audio', brand: 'Sony', model: 'X1', stock: 3 } }],
      isLoading: false,
      refetch: refetchMock,
    });

    render(
      <MemoryRouter>
        <ProductsTableHarness />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'edit-first' }));
    expect(screen.getByTestId('feedback')).toHaveTextContent('error:No se encontró el identificador del producto para editar.');

    await user.click(screen.getByRole('button', { name: 'delete-first' }));
    expect(screen.getByTestId('feedback')).toHaveTextContent('error:No se encontró el identificador del producto para eliminar.');
  });
});

describe('table and common presentational components', () => {
  it('renders data rows, empty state, loading state, and row actions in DynamicDataTable', async () => {
    const user = userEvent.setup();
    const editMock = vi.fn();
    const deleteMock = vi.fn();

    const { rerender } = render(
      <DynamicDataTable
        columns={[{ key: 'name', header: 'Nombre' }, { key: 'price', header: 'Precio', render: (row: { price: number }) => `$${row.price}` }]}
        data={[]}
        getRowId={(row: { id?: string }) => row.id ?? '0'}
        emptyMessage="Sin datos"
        isLoading
      />,
    );

    expect(screen.getByText('Cargando datos...')).toBeInTheDocument();

    rerender(
      <DynamicDataTable
        columns={[{ key: 'name', header: 'Nombre' }, { key: 'price', header: 'Precio', render: (row: { price: number }) => `$${row.price}` }]}
        data={[]}
        getRowId={(row: { id?: string }) => row.id ?? '0'}
        emptyMessage="Sin datos"
      />,
    );

    expect(screen.getByText('Sin datos')).toBeInTheDocument();

    rerender(
      <DynamicDataTable
        columns={[{ key: 'name', header: 'Nombre' }, { key: 'price', header: 'Precio', render: (row: { price: number }) => `$${row.price}` }]}
        data={[{ id: '1', name: 'Tablet', price: 10 }]}
        getRowId={(row: { id?: string }) => row.id ?? '0'}
        onEdit={editMock}
        onDelete={deleteMock}
      />,
    );

    expect(screen.getByText('Tablet')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Editar' }));
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(editMock).toHaveBeenCalledWith({ id: '1', name: 'Tablet', price: 10 });
    expect(deleteMock).toHaveBeenCalledWith({ id: '1', name: 'Tablet', price: 10 });
  });

  it('renders alert, card, and form error helpers only when they have content', () => {
    const { rerender } = render(
      <div>
        <Alert message="Saved" variant="success" />
        <Card className="custom-class">
          <span>Body</span>
        </Card>
        <FormError message="Required field" />
      </div>,
    );

    expect(screen.getAllByRole('alert')[0]).toHaveTextContent('Saved');
    expect(screen.getByText('Body').parentElement).toHaveClass('custom-class');
    expect(screen.getByText('Required field')).toBeInTheDocument();

    rerender(
      <div>
        <Alert />
        <FormError />
      </div>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByText('Required field')).not.toBeInTheDocument();
  });
});
