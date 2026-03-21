import React, { useState } from "react";
import { Section, DynamicForm as ProductForm } from "../components/index";
import { Product } from "../types/Product";
import { FormField } from "../types/FormField";
import { validate } from "../utils/validation";
import { useCreateProductMutation } from "../stores/slices/api/productApi";
import { Response } from "../types/Response";

const PRODUCT_FIELDS: FormField[] = [
  {
    id: "code",
    label: "Código",
    type: "text",
    placeholder: "Escribir el código",
    required: true,
    minLength: 3,
    maxLength: 5,
  },
  {
    id: "name",
    label: "Nombre",
    type: "text",
    placeholder: "Escribir el nombre",
    required: true,
    minLength: 4,
    maxLength: 8,
  },
  {
    id: "price",
    label: "Precio",
    type: "number",
    colSpan: 2,
    placeholder: "Escribir el precio",
    required: true,
    min: 0.01,
    step: 0.01,
  },
  {
    id: "description",
    label: "Descripción",
    type: "textarea",
    colSpan: 2,
    placeholder: "Escribir la descripción",
    required: false,
  },
  {
    id: "category",
    label: "Categoría",
    type: "text",
    placeholder: "Escribir la categoría",
    required: true,
    minLength: 4,
    maxLength: 8,
  },
  {
    id: "brand",
    label: "Marca",
    type: "text",
    placeholder: "Escribir la marca",
    required: true,
    minLength: 4,
    maxLength: 6,
  },
  {
    id: "model",
    label: "Modelo",
    type: "text",
    placeholder: "Escribir el modelo",
    required: true,
    minLength: 2,
    maxLength: 6,
  },
  {
    id: "stock",
    label: "Stock",
    type: "number",
    placeholder: "Escribir la cantidad de stock",
    required: true,
    min: 2,
    step: 1,
  }
];

const RegisterProductsPage: React.FC = () => {
  const [values, setValues] = useState<Product>({
    code: "",
    name: "",
    price: 0,
    description: "",
    category: "",
    brand: "",
    model: "",
    stock: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});
  const [
    createProduct,
    { error }
    // { isLoading, isSuccess, isError, error }
  ] = useCreateProductMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof Product, string>> = {};
    (Object.keys(values) as Array<keyof Product>).forEach((key) => {
      const error = validate(key, values[key], PRODUCT_FIELDS);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const response: Response = await createProduct(values as Product).unwrap();
      console.log(response);
      // if (response._statusCode === 201) {
      //   console.log(response);
      //   localStorage.setItem("products", JSON.stringify(values));
      //   handleReset();
      // }

    }
  };

  console.log(error)

  const handleChange = <K extends keyof Product>(id: K, value: Product[K]) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    const error = validate(id, value, PRODUCT_FIELDS);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  const handleReset = () => {
    setValues({
      code: "",
      name: "",
      price: 0,
      description: "",
      category: "",
      brand: "",
      model: "",
      stock: 0,
    });
    setErrors({});
  };

  return (
    <Section
      title="Registrar productos"
      headingLevel={1}
    >
      <ProductForm
        fields={PRODUCT_FIELDS}
        handleChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Guardar producto"
        resetLabel="Limpiar"
        ariaLabel="Formulario de registro de productos"
        values={values}
        errors={errors}
        onReset={handleReset}
        columns={2}
      />
    </Section>
  );
};

export default RegisterProductsPage;