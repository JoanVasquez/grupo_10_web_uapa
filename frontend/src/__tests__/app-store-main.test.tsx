import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { HEADER_ACTIONS } from '../components/common/Icons/iconsData';
import { store } from '../stores';
import { authApi } from '../stores/slices/api/authApi';
import { productApi } from '../stores/slices/api/productApi';

const renderCalls: unknown[] = [];
const createRootMock = vi.fn(() => ({
  render: vi.fn((tree) => {
    renderCalls.push(tree);
  }),
}));

vi.mock('react-dom/client', () => ({
  default: { createRoot: createRootMock },
  createRoot: createRootMock,
}));

describe('app shell and store wiring', () => {
  beforeEach(() => {
    renderCalls.length = 0;
    createRootMock.mockClear();
  });

  it('renders the auth route inside the shared layout shell', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getAllByRole('button', { name: /sign in/i })).toHaveLength(2);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(HEADER_ACTIONS).toHaveLength(2);
  });

  it('registers both api reducers in the shared store', () => {
    const state = store.getState();

    expect(state).toHaveProperty(authApi.reducerPath);
    expect(state).toHaveProperty(productApi.reducerPath);
    expect(typeof store.dispatch).toBe('function');
  });

  it('boots the React entrypoint against the root element', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('../main');

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'));
    await waitFor(() => expect(renderCalls).toHaveLength(1));
  });
});
