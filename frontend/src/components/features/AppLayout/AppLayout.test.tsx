import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../../stores/slices/api/authApi";
import authReducer from "../../../stores/slices/authSlice";
import AppLayout from "./AppLayout";
import { HEADER_ACTIONS } from "../../common/Icons/iconsData";

const buildStore = (token: string | null) =>
  configureStore({
    reducer: { auth: authReducer, [authApi.reducerPath]: authApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
    preloadedState: { auth: { token } },
  });

describe("AppLayout", () => {
  it("renders AuthPage on /", () => {
    render(
      <Provider store={buildStore(null)}>
        <MemoryRouter initialEntries={["/"]}>
          <AppLayout sidebarTitle="SETTINGS" headerActions={HEADER_ACTIONS} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("redirects /dashboard to AuthPage when no token", () => {
    render(
      <Provider store={buildStore(null)}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <AppLayout sidebarTitle="SETTINGS" headerActions={HEADER_ACTIONS} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByLabelText("Sidebar")).not.toBeInTheDocument();
  });

  it("renders Dashboard on /dashboard when token is present", () => {
    render(
      <Provider store={buildStore("fake-token")}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <AppLayout sidebarTitle="SETTINGS" headerActions={HEADER_ACTIONS} />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
  });
});
