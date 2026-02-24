import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DynamicForm from "./DynamicForm";
import type { FormField } from "../../../types/FormField";

const fields: FormField[] = [
  { id: "code", label: "Code", type: "text" },
  { id: "description", label: "Description", type: "textarea" },
];

describe("DynamicForm", () => {
  it("renders fields and custom button labels", () => {
    render(
      <DynamicForm
        fields={fields}
        onSubmit={vi.fn()}
        submitLabel="Save"
        resetLabel="Clear"
      />
    );

    expect(screen.getByLabelText("Code")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("submits entered values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<DynamicForm fields={fields} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Code"), "A-01");
    await user.type(screen.getByLabelText("Description"), "Product details");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      code: "A-01",
      description: "Product details",
    });
  });

  it("resets values and calls onReset", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(<DynamicForm fields={fields} onSubmit={vi.fn()} onReset={onReset} />);

    const codeInput = screen.getByLabelText("Code");
    await user.type(codeInput, "A-01");
    await user.click(screen.getByRole("button", { name: "Limpiar" }));

    expect(codeInput).toHaveValue("");
    expect(onReset).toHaveBeenCalled();
  });
});
