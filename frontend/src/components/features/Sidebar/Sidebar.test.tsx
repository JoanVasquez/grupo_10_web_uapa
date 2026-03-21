import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  it("renders title and navigation items", () => {
    render(
      <MemoryRouter>
        <Sidebar title="SETTINGS" />
      </MemoryRouter>
    );

    expect(screen.getAllByText("SETTINGS").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Formularios/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Tablas/i }).length).toBeGreaterThan(0);
  });

  it("calls onClose when clicking overlay", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <Sidebar title="SETTINGS" isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    const overlay = screen.getByLabelText("Cerrar menú");
    await user.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
