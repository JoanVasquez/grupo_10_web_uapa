import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Textarea from "./Textarea";

describe("Textarea", () => {
  it("associates label and textarea", () => {
    render(<Textarea id="desc" label="Description" />);

    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("displays error text and accessibility attributes", () => {
    render(<Textarea id="note" label="Note" error="Required field" />);

    const textarea = screen.getByLabelText("Note");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", "note-error");
    expect(screen.getByText("Required field")).toHaveAttribute("id", "note-error");
  });

  it("supports typing", async () => {
    const user = userEvent.setup();
    render(<Textarea id="obs" label="Observations" />);

    const textarea = screen.getByLabelText("Observations");
    await user.type(textarea, "Some text");

    expect(textarea).toHaveValue("Some text");
  });
});
