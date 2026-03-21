import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormField } from "../types/FormField";
import { Product } from "../types/Product";
import { ApiMutationError, Response } from "../types/Response";
import { validate } from "../utils/validation";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../stores/slices/api/productApi";

export const PRODUCT_FIELDS: FormField[] = [
  { id: "code", label: "Código", type: "text", placeholder: "Escribir el código", required: true, minLength: 3, maxLength: 5 },
  { id: "name", label: "Nombre", type: "text", placeholder: "Escribir el nombre", required: true, minLength: 4, maxLength: 8 },
  { id: "price", label: "Precio", type: "number", colSpan: 2, placeholder: "Escribir el precio", required: true, min: 0.01, step: 0.01 },
  { id: "description", label: "Descripción", type: "textarea", colSpan: 2, placeholder: "Escribir la descripción", required: false },
  { id: "category", label: "Categoría", type: "text", placeholder: "Escribir la categoría", required: true, minLength: 4, maxLength: 8 },
  { id: "brand", label: "Marca", type: "text", placeholder: "Escribir la marca", required: true, minLength: 4, maxLength: 6 },
  { id: "model", label: "Modelo", type: "text", placeholder: "Escribir el modelo", required: true, minLength: 2, maxLength: 6 },
  { id: "stock", label: "Stock", type: "number", placeholder: "Escribir la cantidad de stock", required: true, min: 2, step: 1 },
];

const INITIAL_VALUES: Product = {
  code: "",
  name: "",
  price: 0,
  description: "",
  category: "",
  brand: "",
  model: "",
  stock: 0,
};

export const useProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [values, setValues] = useState<Product>(INITIAL_VALUES);
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const isEditing = Boolean(id);
  const { data: productResponse, isLoading: isLoadingProduct } = useGetProductByIdQuery(id ?? "", { skip: !id });

  useEffect(() => {
    if (productResponse?._data && isEditing) {
      setValues(productResponse._data as Product);
    }
  }, [isEditing, productResponse]);

  const pageTitle = useMemo(() => (isEditing ? "Actualizar producto" : "Registrar productos"), [isEditing]);

  const handleApiError = (error: unknown, fallbackMessage: string) => {
    const mutationError = error as ApiMutationError;
    const message = mutationError.data?._message;

    if (mutationError.status === 403 && typeof message === "string" && message.includes("expired token")) {
      localStorage.removeItem("token");
      navigate("/", { replace: true });
      return true;
    }

    setSubmitError(typeof message === "string" ? message : fallbackMessage);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof Product, string>> = {};
    (Object.keys(values) as Array<keyof Product>).forEach((key) => {
      if (key === "id") {
        return;
      }

      const error = validate(key, values[key], PRODUCT_FIELDS);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response: Response = isEditing
          ? await updateProduct({ ...values, ...(id ? { id } : {}) }).unwrap()
          : await createProduct(values).unwrap();

        if (response._statusCode === 201 || response._statusCode === 200) {
          if (!isEditing) {
            setValues(INITIAL_VALUES);
            setErrors({});
          }

          setSubmitError("");
          setSubmitSuccess(isEditing ? "Producto actualizado correctamente." : "Producto registrado correctamente.");
        }
      } catch (error: unknown) {
        handleApiError(error, isEditing ? "No se pudo actualizar el producto." : "No se pudo registrar el producto.");
      }
    }
  };

  const handleChange = <K extends keyof Product>(fieldId: K, value: Product[K]) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    const error = validate(fieldId, value, PRODUCT_FIELDS);
    setErrors((prev) => ({ ...prev, [fieldId]: error }));
    setSubmitError("");
    setSubmitSuccess("");
  };

  const handleReset = () => {
    setValues(INITIAL_VALUES);
    setErrors({});
    setSubmitError("");
    setSubmitSuccess("");
  };

  return {
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
  };
};
