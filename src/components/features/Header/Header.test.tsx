import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

describe("Header", () => {
  it("renders actions, badge and avatar", () => {
    render(
      <Header
        actions={[
          { id: "notif", label: "Notifications", badge: 4, icon: <span>Bell</span> },
          { id: "mail", label: "Messages", icon: <span>Mail</span> },
        ]}
        avatar="https://example.com/avatar.png"
        avatarAlt="Joan"
      />
    );

    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Messages" })).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Joan" })).toBeInTheDocument();
  });

  it("calls action and menu handlers", async () => {
    const user = userEvent.setup();
    const onMenuClick = vi.fn();
    const onActionClick = vi.fn();

    render(
      <Header
        onMenuClick={onMenuClick}
        actions={[{ id: "notif", label: "Notifications", icon: <span>Bell</span>, onClick: onActionClick }]}
      />
    );

    await user.click(screen.getByLabelText("Toggle menu"));
    await user.click(screen.getByRole("button", { name: "Notifications" }));

    expect(onMenuClick).toHaveBeenCalledTimes(1);
    expect(onActionClick).toHaveBeenCalledTimes(1);
  });
});
