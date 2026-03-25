import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../../stores/slices/api/authApi";
import { productApi } from "../../../stores/slices/api/productApi";
import Dashboard from "./DashBoard";

const HEADER_ACTIONS = [{ id: "bell", label: "Notifications", icon: <span>Bell</span> }];
const getProductQueryMock = vi.fn(() => ({ data: { _data: [] }, isLoading: false }));
const fetchMock = vi.fn();

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

const renderDashboard = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }

  return render(
    <Provider store={buildStore()}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard/*"
            element={<Dashboard sidebarTitle="SETTINGS" headerActions={HEADER_ACTIONS} />}
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

beforeEach(() => {
  localStorage.clear();
  getProductQueryMock.mockClear();
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const createToken = (payload: Record<string, unknown>) => {
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `header.${encodedPayload}.signature`;
};

describe("Dashboard", () => {
  it("redirects to / when there is no token", () => {
    renderDashboard(null);

    expect(screen.queryByLabelText("Sidebar")).not.toBeInTheDocument();
  });

  it("renders sidebar and header when token is present", () => {
    renderDashboard("fake-token");

    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
  });

  it("toggles sidebar overlay from menu button", async () => {
    const user = userEvent.setup();
    renderDashboard("fake-token");

    expect(screen.queryByLabelText("Cerrar menú")).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("Toggle menu"));
    expect(screen.getByLabelText("Cerrar menú")).toBeInTheDocument();
  });

  it("uses the decoded username from the token when no username is stored", () => {
    renderDashboard(createToken({ userName: "Token User" }));

    expect(screen.getAllByText("Token User")).not.toHaveLength(0);
    expect(localStorage.getItem("username")).toBe("Token User");
  });

  it("falls back to the default username when the token payload cannot be decoded", () => {
    renderDashboard("invalid.token.value");

    expect(screen.getAllByText("Usuario")).not.toHaveLength(0);
    expect(localStorage.getItem("username")).toBeNull();
  });
});
