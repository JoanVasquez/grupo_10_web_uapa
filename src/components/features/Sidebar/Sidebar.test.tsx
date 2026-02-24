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

    expect(screen.getByText("SETTINGS")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Formularios/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Tablas/i })).toBeInTheDocument();
  });

  it("calls onClose when clicking overlay", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <Sidebar title="SETTINGS" isOpen={true} onClose={onClose} />
      </MemoryRouter>
    );

    const overlay = container.querySelector("div[aria-hidden='true']");
    expect(overlay).not.toBeNull();

    if (overlay) {
      await user.click(overlay);
    }

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
