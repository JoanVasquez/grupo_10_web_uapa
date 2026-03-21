import React from "react";
import { Input, Textarea, Button } from "../../index";
import { FormField } from "../../../types/FormField";

export type { FormField };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

interface DynamicFormProps<T extends AnyRecord> {
  fields: FormField[];
  onSubmit: (e: React.FormEvent) => void;
  onReset?: () => void;
  submitLabel?: string;
  resetLabel?: string;
  ariaLabel?: string;
  handleChange: <K extends keyof T>(id: K, value: T[K]) => void;
  values: T;
  errors?: Partial<Record<keyof T, string>>;
  columns?: 1 | 2;
}

function DynamicForm<T extends AnyRecord>({
  fields,
  onSubmit,
  onReset,
  submitLabel = "Guardar",
  resetLabel = "Limpiar",
  ariaLabel = "Dynamic form",
  handleChange,
  values,
  errors = {},
  columns = 2,
}: DynamicFormProps<T>) {
  const mapInputValue = <K extends keyof T>(fieldType: FormField["type"], rawValue: string): T[K] => {
    return (fieldType === "number" ? Number(rawValue) : rawValue) as T[K];
  };

  return (
    <form onSubmit={onSubmit} onReset={onReset} className="space-y-6" aria-label={ariaLabel}>
      <div className={columns === 2 ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
        {fields.map((field) => {
          const fieldId = field.id as keyof T;
          const fieldValue = values[fieldId];
          const error = errors[fieldId];
          const spanClass = field.colSpan === 2 ? "sm:col-span-2" : "";

          if (field.type === "textarea") {
            return (
              <div key={field.id} className={spanClass}>
                <Textarea
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={fieldValue ?? ""}
                  error={error}
                  onChange={(e) =>
                    handleChange(fieldId, mapInputValue<typeof fieldId>(field.type, e.target.value))
                  }
                />
              </div>
            );
          }

          return (
            <div key={field.id} className={spanClass}>
              <Input
                id={field.id}
                label={field.label}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={fieldValue ?? ""}
                error={error}
                onChange={(e) =>
                  handleChange(fieldId, mapInputValue<typeof fieldId>(field.type, e.target.value))
                }
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit">{submitLabel}</Button>
        {onReset && (
          <Button type="reset" variant="secondary" onClick={onReset}>
            {resetLabel}
          </Button>
        )}
      </div>
    </form>
  );
}

export default DynamicForm;