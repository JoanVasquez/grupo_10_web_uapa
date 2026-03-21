import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  it("renders title and navigation items", () => {
    render(
      <MemoryRouter>
        <Sidebar title="Panel de gestión" />
      </MemoryRouter>
    );

    expect(screen.getAllByText("Panel de gestión").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Resumen general/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Registrar producto/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Lista de productos/i }).length).toBeGreaterThan(0);
  });

  it("marks only the matching route as active", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/form"]}>
        <Sidebar title="Panel de gestión" />
      </MemoryRouter>
    );

    screen.getAllByRole("link", { name: /Registrar producto/i }).forEach((link) => {
      expect(link).toHaveClass("bg-blue-600");
    });
    screen.getAllByRole("link", { name: /Resumen general/i }).forEach((link) => {
      expect(link).not.toHaveClass("bg-blue-600");
    });
  });

  it("calls onClose when clicking overlay", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <Sidebar title="Panel de gestión" isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    const overlay = screen.getByLabelText("Cerrar menú");
    await user.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
