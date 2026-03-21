import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../../stores/slices/api/authApi";
import { productApi } from "../../../stores/slices/api/productApi";
import AppLayout from "./AppLayout";
import { HEADER_ACTIONS } from "../../common/Icons/iconsData";

const getProductQueryMock = vi.fn(() => ({ data: { _data: [] }, isLoading: false }));

vi.mock("../../../stores/slices/api/productApi", async () => {
  const actual = await vi.importActual<typeof import("../../../stores/slices/api/productApi")>("../../../stores/slices/api/productApi");
  return {
    ...actual,
    useGetProductQuery: () => getProductQueryMock(),
    productApi: actual.productApi,
  };
});

const buildStore = () =>
  configureStore({
    reducer: {
      [authApi.reducerPath]: authApi.reducer,
      [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, productApi.middleware),
  });

beforeEach(() => {
  localStorage.clear();
  getProductQueryMock.mockClear();
});

describe("AppLayout", () => {
  it("renders AuthPage on /", () => {
    render(
      <Provider store={buildStore()}>
        <MemoryRouter initialEntries={["/"]}>
          <AppLayout sidebarTitle="SETTINGS" headerActions={HEADER_ACTIONS} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByRole("button", { name: /sign in/i }).length).toBeGreaterThan(0);
  });

  it("redirects /dashboard to AuthPage when no token", () => {
    render(
      <Provider store={buildStore()}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <AppLayout sidebarTitle="SETTINGS" headerActions={HEADER_ACTIONS} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByLabelText("Sidebar")).not.toBeInTheDocument();
  });

  it("renders Dashboard on /dashboard when token is present", () => {
    localStorage.setItem("token", "fake-token");

    render(
      <Provider store={buildStore()}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <AppLayout sidebarTitle="SETTINGS" headerActions={HEADER_ACTIONS} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
  });
});
