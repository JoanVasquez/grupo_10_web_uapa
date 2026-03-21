import React from "react";
import { Alert, Section, DynamicForm as ProductForm } from "../components/index";
import { PRODUCT_FIELDS, useProductForm } from "../hooks/useProductForm";

const RegisterProductsPage: React.FC = () => {
  const {
    errors,
    handleChange,
    handleReset,
    handleSubmit,
    isEditing,
    isLoadingProduct,
    pageTitle,
    submitError,
    submitSuccess,
    values,
  } = useProductForm();

  return (
    <Section
      title={pageTitle}
      subtitle="Completa el formulario cómodamente desde móvil, tablet o escritorio."
      headingLevel={1}
    >
      <div className="space-y-4">
        <Alert message={submitSuccess} variant="success" />
        <Alert message={submitError} variant="error" />
        {isEditing && isLoadingProduct ? (
          <p className="text-sm text-slate-500">Cargando producto...</p>
        ) : (
          <ProductForm
            fields={PRODUCT_FIELDS}
            handleChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel={isEditing ? "Actualizar producto" : "Guardar producto"}
            resetLabel="Limpiar"
            ariaLabel="Formulario de registro de productos"
            values={values}
            errors={errors}
            onReset={handleReset}
            columns={2}
          />
        )}
      </div>
    </Section>
  );
};

export default RegisterProductsPage;
