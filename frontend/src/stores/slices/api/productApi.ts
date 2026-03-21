import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_API } from '../../../utils/constants'
import { Response } from '../../../types/Response';
import { Product } from '../../../types/Product';

export const productApi = createApi({
    reducerPath: 'productApi',
    tagTypes: ['Product'],
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    endpoints: (builder) => ({
        createProduct: builder.mutation<Response, Product>({
            query: (productData: Product) => ({
                url: '/api/product',
                method: 'POST',
                body: productData,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation<Response, Product>({
            query: (productData: Product) => ({
                url: '/api/product',
                method: 'PUT',
                body: productData,
            }),
            invalidatesTags: ['Product'],
        }),
        getProduct: builder.query<Response<Product[]> | Response<Product>[], void>({
            query: () => ({
                url: '/api/product',
                method: 'GET',
            }),
            providesTags: ['Product'],
        }),
        getProductById: builder.query<Response<Product>, string>({
            query: (id: string) => ({
                url: `/api/product/${id}`,
                method: 'GET',
            }),
            providesTags: ['Product'],
        }),
        deleteProduct: builder.mutation<Response<{ id?: string }>, string>({
            query: (id: string) => ({
                url: `/api/product/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
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
