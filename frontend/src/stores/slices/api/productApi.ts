import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_API } from '../../../utils/constants'
import { Response } from '../../../types/Response';
import { Product } from '../../../types/Product';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_API }),
    endpoints: (builder) => ({
        createProduct: builder.mutation<Response, Product>({
            query: (productData: Product) => ({
                url: '/api/product',
                method: 'POST',
                body: productData,
            }),
        }),
        updateProduct: builder.mutation<Response, Product>({
            query: (productData: Product) => ({
                url: '/api/product',
                method: 'PUT',
                body: productData,
            }),
        }),
        getProduct: builder.query<Response[], void>({
            query: () => ({
                url: '/api/product',
                method: 'GET',
            })
        }),
        getProductById: builder.query<Response, string>({
            query: (id: string) => ({
                url: `/api/product/${id}`,
                method: 'GET',
            })
        }),
        deleteProduct: builder.mutation<Response, string>({
            query: (id: string) => ({
                url: `/api/product/${id}`,
                method: 'DELETE',
            })
        })
    }),
});

export const {
    useCreateProductMutation,
    useUpdateProductMutation,
    useGetProductQuery,
    useGetProductByIdQuery,
    useDeleteProductMutation
} = productApi;