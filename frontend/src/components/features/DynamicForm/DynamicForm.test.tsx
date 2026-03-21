import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DynamicForm, { FormField } from "./DynamicForm";

type FormValues = {
  code: string;
  description: string;
};

const INITIAL_VALUES: FormValues = {
  code: "",
  description: "",
};

const fields: FormField[] = [
  { id: "code", label: "Code", type: "text" },
  { id: "description", label: "Description", type: "textarea" },
];

type TestFormProps = {
  onSubmit?: (e: React.FormEvent) => void;
  onReset?: () => void;
  submitLabel?: string;
  resetLabel?: string;
};

const TestForm: React.FC<TestFormProps> = ({
  onSubmit = vi.fn(),
  onReset,
  submitLabel,
  resetLabel,
}) => {
  const [values, setValues] = React.useState<FormValues>(INITIAL_VALUES);

  const handleChange = <K extends keyof FormValues>(id: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    onReset?.();
  };

  return (
    <DynamicForm<FormValues>
      fields={fields}
      onSubmit={onSubmit}
      onReset={handleReset}
      {...(submitLabel ? { submitLabel } : {})}
      {...(resetLabel ? { resetLabel } : {})}
      handleChange={handleChange}
      values={values}
    />
  );
};

describe("DynamicForm", () => {
  it("renders fields and custom button labels", () => {
    render(<TestForm submitLabel="Save" resetLabel="Clear" />);

    expect(screen.getByLabelText("Code")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });

  it("submits entered values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TestForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Code"), "A-01");
    await user.type(screen.getByLabelText("Description"), "Product details");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByLabelText("Code")).toHaveValue("A-01");
    expect(screen.getByLabelText("Description")).toHaveValue("Product details");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("resets values and calls onReset", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(<TestForm onReset={onReset} />);

    const codeInput = screen.getByLabelText("Code");
    await user.type(codeInput, "A-01");
    await user.click(screen.getByRole("button", { name: "Limpiar" }));

    expect(codeInput).toHaveValue("");
    expect(onReset).toHaveBeenCalled();
  });
});
