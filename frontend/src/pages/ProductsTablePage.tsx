import React from "react";
import { Alert, DynamicDataTable, Section } from "../components";
import { useProductsTable } from "../hooks/useProductsTable";

const ProductsTablePage: React.FC = () => {
  const { columns, feedback, handleDelete, handleEdit, isLoading, products } = useProductsTable();

  return (
    <Section
      title="Listado de productos"
      subtitle="Consulta, edita y elimina productos desde cualquier tamaño de pantalla."
      headingLevel={1}
    >
      <div className="space-y-4">
        <Alert message={feedback?.type === "success" ? feedback.message : ""} variant="success" />
        <Alert message={feedback?.type === "error" ? feedback.message : ""} variant="error" />
        <DynamicDataTable
          columns={columns}
          data={products}
          getRowId={(product) => product.id ?? product.code}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
          emptyMessage="No hay productos registrados todavía."
        />
      </div>
    </Section>
  );
};

export default ProductsTablePage;
