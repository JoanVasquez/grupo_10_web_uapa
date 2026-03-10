import React, { useState } from "react";
import { Section } from "../components/index";
import { DynamicForm as ProductForm } from "../components/index";
import { Product } from "../types/Product";
import { FormField } from "../types/FormField";

const PRODUCT_FIELDS: FormField[] = [
  { id: "code", label: "Codigo", type: "text", placeholder: "Escribir el codigo", required: true, minLength: 3, maxLength: 5 },
  { id: "name", label: "Nombre", type: "text", placeholder: "Escribir el nombre", required: true, minLength: 4, maxLength: 8 },
  {
    id: "description",
    label: "Descripcion",
    type: "textarea",
    colSpan: 2,
    placeholder: "Escribir la descripcion",
  },
  { id: "category", label: "Categoría", type: "text", placeholder: "Escribir la categoria", required: true, minLength: 4, maxLength: 8 },
  { id: "brand", label: "Marca", type: "text", placeholder: "Escribir la marca", required: true, minLength: 4, maxLength: 6 },
  { id: "model", label: "Modelo", type: "text", placeholder: "Escribir el modelo", required: true, minLength: 2, maxLength: 6 },
  { id: "stock", label: "Stock", type: "number", placeholder: "Escribir la cantidad de stock", required: true, min: 1 },
];

const RegisterProductsPage: React.FC = () => {
  const [values, setValues] = useState<Product>({
    code: "",
    name: "",
    description: "",
    category: "",
    brand: "",
    model: "",
    stock: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});

  const validate = (field: keyof Product, value: Product[keyof Product]): string | undefined => {
    const fieldConfig = PRODUCT_FIELDS.find(f => f.id === field);
    if (!fieldConfig) return;

    const strValue = String(value);

    if (fieldConfig.required && !strValue.trim()) {
      return "Este campo es obligatorio";
    }

    if (fieldConfig.minLength && strValue.length < fieldConfig.minLength) {
      return `Mínimo ${fieldConfig.minLength} caracteres`;
    }

    if (fieldConfig.maxLength && strValue.length > fieldConfig.maxLength) {
      return `Máximo ${fieldConfig.maxLength} caracteres`;
    }

    if (fieldConfig.type === "number" && fieldConfig.min !== undefined) {
      const numValue = Number(value);
      if (numValue < fieldConfig.min) {
        return `Mínimo ${fieldConfig.min}`;
      }
    }

    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Record<keyof Product, string>> = {};
    (Object.keys(values) as Array<keyof Product>).forEach(key => {
      const error = validate(key, values[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      localStorage.setItem("products", JSON.stringify(values));
      alert("Producto guardado exitosamente");
      handleReset();
    }
  };

  const handleChange = <K extends keyof Product>(id: K, value: Product[K]) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    const error = validate(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleReset = () => {
    setValues({
      code: "",
      name: "",
      description: "",
      category: "",
      brand: "",
      model: "",
      stock: 0,
    });
    setErrors({});
  };

  return (
    <Section title="Registrar Productos" headingLevel={1}>
      <ProductForm<Product>
        fields={PRODUCT_FIELDS}
        handleChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Guardar"
        resetLabel="Limpiar"
        ariaLabel="Formulario de registro de productos"
        values={values}
        errors={errors}
        onReset={handleReset}
      />
    </Section>
  );
};

export default RegisterProductsPage;
