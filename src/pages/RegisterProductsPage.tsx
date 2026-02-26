import React, { useState } from "react";
import { Section } from "../components/index";
import { DynamicForm as ProductForm } from "../components/index";
import { FormField } from "../types/FormField";
import { Product } from "../types/Product";

const PRODUCT_FIELDS: FormField[] = [
  { id: "code", label: "Codigo", type: "text", placeholder: "Escribir el codigo" },
  { id: "name", label: "Nombre", type: "text", placeholder: "Escribir el nombre" },
  {
    id: "description",
    label: "Descripcion",
    type: "textarea",
    colSpan: 2,
    placeholder: "Escribir la descripcion",
  },
  { id: "category", label: "Categoría", type: "text", placeholder: "Escribir la categoria" },
  { id: "brand", label: "Marca", type: "text", placeholder: "Escribir la marca" },
  { id: "model", label: "Modelo", type: "text", placeholder: "Escribir el modelo" },
  { id: "stock", label: "Stock", type: "number", placeholder: "Escribir la cantidad de stock" },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleChange = <K extends keyof Product>(id: K, value: Product[K]) => {
    setValues((prev) => ({ ...prev, [id]: value }));
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
      />
    </Section>
  );
};

export default RegisterProductsPage;
