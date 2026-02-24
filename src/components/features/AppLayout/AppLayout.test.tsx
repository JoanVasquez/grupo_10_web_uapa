import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AppLayout from "./AppLayout";

describe("AppLayout", () => {
  it("renders layout with sidebar and header actions", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppLayout
          sidebarTitle="SETTINGS"
          headerActions={[{ id: "bell", label: "Notifications", icon: <span>Bell</span> }]}
          avatar="https://example.com/a.png"
        />
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Sidebar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Registrar Productos" })).toBeInTheDocument();
  });

  it("toggles sidebar overlay from menu button", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <AppLayout
          sidebarTitle="SETTINGS"
          headerActions={[{ id: "bell", label: "Notifications", icon: <span>Bell</span> }]}
        />
      </MemoryRouter>
    );

    expect(container.querySelector("div[aria-hidden='true']")).toBeNull();

    await user.click(screen.getByLabelText("Toggle menu"));

    expect(container.querySelector("div[aria-hidden='true']")).not.toBeNull();
  });
});
