import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../../stores/slices/api/authApi";
import authReducer from "../../../stores/slices/authSlice";
import Dashboard from "./DashBoard";

const HEADER_ACTIONS = [{ id: "bell", label: "Notifications", icon: <span>Bell</span> }];

const buildStore = (token: string | null) =>
  configureStore({
    reducer: { auth: authReducer, [authApi.reducerPath]: authApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
    preloadedState: { auth: { token } },
  });

const renderDashboard = (token: string | null) =>
  render(
    <Provider store={buildStore(token)}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Dashboard sidebarTitle="SETTINGS" headerActions={HEADER_ACTIONS} />
      </MemoryRouter>
    </Provider>
  );

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
    const { container } = renderDashboard("fake-token");

    expect(container.querySelector("div[aria-hidden='true']")).toBeNull();
    await user.click(screen.getByLabelText("Toggle menu"));
    expect(container.querySelector("div[aria-hidden='true']")).not.toBeNull();
  });
});
