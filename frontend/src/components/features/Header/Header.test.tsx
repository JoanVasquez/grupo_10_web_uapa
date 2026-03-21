import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

describe("Header", () => {
  it("renders actions, badge, avatar and username", () => {
    render(
      <Header
        actions={[
          { id: "notif", label: "Notificaciones", badge: 4, icon: <span>Bell</span> },
          { id: "mail", label: "Mensajes", icon: <span>Mail</span> },
        ]}
        avatar="https://example.com/avatar.png"
        avatarAlt="Joan"
        userName="Joan"
      />
    );

    expect(screen.getByRole("button", { name: "Notificaciones" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mensajes" })).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Joan" })).toBeInTheDocument();
    expect(screen.getAllByText("Joan").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  it("calls action, menu and logout handlers", async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();
    const onActionClick = vi.fn();
    const onLogout = vi.fn();

    render(
      <Header
        onMenuClick={onMenuClick}
        onLogout={onLogout}
        actions={[{ id: "notif", label: "Notificaciones", icon: <span>Bell</span>, onClick: onActionClick }]}
      />
    );

    await user.click(screen.getByLabelText("Toggle menu"));
    await user.click(screen.getByRole("button", { name: "Notificaciones" }));
    await user.click(screen.getByRole("button", { name: /cerrar sesión/i }));

    expect(onMenuClick).toHaveBeenCalledTimes(1);
    expect(onActionClick).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });
});
