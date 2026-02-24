import React, { useState } from "react";
import type { FormField } from "../../../types/FormField";
import { Input } from "../../index";
import { Textarea } from "../../index";
import { Button } from "../../index";
import styles from "./DynamicForm.module.css";

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => void;
  onReset?: () => void;
  submitLabel?: string;
  resetLabel?: string;
  ariaLabel?: string;
}

const ProductForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  onReset,
  submitLabel = "Guardar",
  resetLabel = "Limpiar",
  ariaLabel = "Dynamic form",
}) => {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleReset = () => {
    setValues({});
    onReset?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className={styles.form}
      aria-label={ariaLabel}
    >
      <fieldset className={styles.grid}>
        <legend className={styles.srOnly}>{ariaLabel}</legend>
        {fields.map((field) => {
          const spanClass = field.colSpan === 2 ? styles.colSpan2 : "";

          if (field.type === "textarea") {
            return (
              <div key={field.id} className={`${styles.field} ${spanClass}`}>
                <Textarea
                  id={field.id}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
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
                value={values[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            </div>
          );
        })}
      </fieldset>

      <div className={styles.actions}>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
        <Button type="reset" variant="secondary" onClick={handleReset}>
          {resetLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
