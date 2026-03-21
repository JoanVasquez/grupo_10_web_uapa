import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

describe("Input", () => {
  it("associates label and input", () => {
    render(<Input id="name" label="Name" />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("displays error text and accessibility attributes", () => {
    render(<Input id="email" label="Email" error="Invalid email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(screen.getByText("Invalid email")).toHaveAttribute("id", "email-error");
  });

  it("supports typing", async () => {
    const user = userEvent.setup();
    render(<Input id="code" label="Code" />);

    const input = screen.getByLabelText("Code");
    await user.type(input, "A-001");

    expect(input).toHaveValue("A-001");
  });
});
