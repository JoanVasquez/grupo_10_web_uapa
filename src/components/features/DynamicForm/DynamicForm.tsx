import React from "react";
import { Input } from "../../index";
import { Textarea } from "../../index";
import { Button } from "../../index";
import { FormError } from "../../index";
import styles from "./DynamicForm.module.css";
import { FormField } from "../../../types/FormField";

export type { FormField };

type FormValue = string | number;

interface DynamicFormProps<T extends { [K in keyof T]: FormValue | undefined }> {
  fields: FormField[];
  onSubmit: (e: React.FormEvent) => void;
  onReset?: () => void;
  submitLabel?: string;
  resetLabel?: string;
  ariaLabel?: string;
  handleChange: <K extends keyof T>(id: K, value: T[K]) => void;
  values: T;
  errors?: { [K in keyof T]?: string };
}

function DynamicForm<T extends { [K in keyof T]: FormValue | undefined }>({
  fields,
  onSubmit,
  onReset,
  submitLabel = "Guardar",
  resetLabel = "Limpiar",
  ariaLabel = "Dynamic form",
  handleChange,
  values,
  errors = {},
}: DynamicFormProps<T>) {
  const mapInputValue = <K extends keyof T>(
    fieldType: FormField["type"],
    rawValue: string,
  ): T[K] => {
    const mappedValue = fieldType === "number" ? Number(rawValue) : rawValue;
    return mappedValue as T[K];
  };

  return (
    <form onSubmit={onSubmit} onReset={onReset} className={styles.form} aria-label={ariaLabel}>
      <fieldset className={styles.grid}>
        <legend className={styles.srOnly}>{ariaLabel}</legend>
        {fields.map((field) => {
          const spanClass = field.colSpan === 2 ? styles.colSpan2 : "";
          const fieldId = field.id as keyof T;
          const fieldValue = values[fieldId];

          if (field.type === "textarea") {
            return (
              <div key={field.id} className={`${styles.field} ${spanClass}`}>
                <Textarea
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={fieldValue ?? ""}
                  onChange={(e) =>
                    handleChange(fieldId, mapInputValue<typeof fieldId>(field.type, e.target.value))
                  }
                />
                <FormError message={errors[fieldId]} />
              </div>
            );
          }

          return (
            <div key={field.id} className={`${styles.field} ${spanClass}`}>
              <Input
                id={field.id}
                label={field.label}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={fieldValue ?? ""}
                onChange={(e) =>
                  handleChange(fieldId, mapInputValue<typeof fieldId>(field.type, e.target.value))
                }
              />
              <FormError message={errors[fieldId]} />
            </div>
          );
        })}
      </fieldset>

      <div className={styles.actions}>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        {onReset ? (
          <Button type="reset" variant="secondary" onClick={onReset}>
            {resetLabel}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export default DynamicForm;
