import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_API } from '../../../utils/constants'
import { Auth, User } from '../../../types/User';
import { Login } from '../../../types/Response';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_API }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData: User) => ({
                url: '/api/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        login: builder.mutation<Login, Auth>({
            query: (credentials: Auth) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.query({
            query: () => ({
                url: '/api/auth/logout',
                method: 'GET',
            })
        })
    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
} = authApi;