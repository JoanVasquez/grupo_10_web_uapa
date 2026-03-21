import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../types/Product";
import { ApiMutationError, Response } from "../types/Response";
import { useDeleteProductMutation, useGetProductQuery } from "../stores/slices/api/productApi";

type ProductCollection = { items: Product[]; total: number };
type ProductQueryResponse = Response<ProductCollection> | Response<Product[]> | Response<Product>[];

const resolveProducts = (response?: ProductQueryResponse): Product[] => {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response
      .map((item) => item._data)
      .filter((product): product is Product => Boolean(product));
  }

  if (Array.isArray(response._data)) {
    return response._data;
  }

  if (response._data && Array.isArray((response._data as ProductCollection).items)) {
    return (response._data as ProductCollection).items;
  }

  return [];
};

export const useProductsTable = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { data, isLoading, refetch } = useGetProductQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const products = useMemo(() => resolveProducts(data), [data]);

  const columns = useMemo(
    () => [
      { key: "code", header: "Código" },
      { key: "name", header: "Nombre" },
      { key: "category", header: "Categoría" },
      { key: "brand", header: "Marca" },
      { key: "price", header: "Precio", render: (product: Product) => `$${Number(product.price).toFixed(2)}` },
      { key: "stock", header: "Stock" },
    ],
    [],
  );

  const handleEdit = (product: Product) => {
    if (!product.id) {
      setFeedback({ type: "error", message: "No se encontró el identificador del producto para editar." });
      return;
    }

    navigate(`/dashboard/form/${product.id}`);
  };

  const handleDelete = async (product: Product) => {
    if (!product.id) {
      setFeedback({ type: "error", message: "No se encontró el identificador del producto para eliminar." });
      return;
    }

    try {
      const response = await deleteProduct(String(product.id)).unwrap();
      setFeedback({ type: "success", message: response._message ?? "Producto eliminado correctamente." });
      localStorage.removeItem(`product-${product.name}`);
      refetch();
    } catch (error: unknown) {
      const mutationError = error as ApiMutationError;
      const message = mutationError.data?._message;
      setFeedback({ type: "error", message: typeof message === "string" ? message : "No se pudo eliminar el producto." });
    }
  };

  return {
    columns,
    feedback,
    handleDelete,
    handleEdit,
    isLoading,
    products,
  };
};
