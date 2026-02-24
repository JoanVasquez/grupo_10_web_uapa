import React from "react";
import { Section } from "../components/index";
import { DynamicForm as ProductForm } from "../components/index";
import { FormField } from "../types/FormField";

const PRODUCT_FIELDS: FormField[] = [
  { id: "codigo", label: "Codigo", type: "text", placeholder: "" },
  { id: "nombre", label: "Nombre", type: "text", placeholder: "" },
  { id: "descripcion", label: "Descripcion", type: "textarea", colSpan: 2 },
  { id: "categoria", label: "Categoría", type: "text", placeholder: "" },
  { id: "marca", label: "Marca", type: "text", placeholder: "" },
  { id: "modelo", label: "Modelo", type: "text", placeholder: "" },
  { id: "stock", label: "Stock", type: "number", placeholder: "" },
];

const RegisterProductsPage: React.FC = () => {
  const handleSubmit = (data: Record<string, string>) => {
    console.log("Product data:", data);
    alert("Producto guardado!\n" + JSON.stringify(data, null, 2));
  };

  return (
    <Section title="Registrar Productos" headingLevel={1}>
      <ProductForm
        fields={PRODUCT_FIELDS}
        onSubmit={handleSubmit}
        submitLabel="Guardar"
        resetLabel="Limpiar"
        ariaLabel="Formulario de registro de productos"
      />
    </Section>
  );
};

export default RegisterProductsPage;
