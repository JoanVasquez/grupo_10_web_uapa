import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import { authApi } from "../../../stores/slices/api/authApi";
import SignUp from "./SignUp";

const store = configureStore({
  reducer: { [authApi.reducerPath]: authApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

const renderSignUp = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    </Provider>
  );

describe("SignUp", () => {
  it("renders all fields and submit button", () => {
    renderSignUp();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    renderSignUp();

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getAllByText("Este campo es obligatorio")).toHaveLength(3);
  });

  it("updates field values on input", async () => {
    const user = userEvent.setup();
    renderSignUp();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.type(screen.getByLabelText(/password/i), "secret123");

    expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
    expect(screen.getByLabelText(/username/i)).toHaveValue("testuser");
    expect(screen.getByLabelText(/password/i)).toHaveValue("secret123");
  });

  it("clears fields on reset", async () => {
    const user = userEvent.setup();
    renderSignUp();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(screen.getByLabelText(/email/i)).toHaveValue("");
  });
});
