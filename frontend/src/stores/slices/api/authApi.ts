import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_API } from "../../../utils/constants";
import { Auth, User } from "../../../types/User";
import { Login, Response } from "../../../types/Response";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<Response<User>, User>({
      query: (userData: User) => ({
        url: "/api/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation<Login, Auth>({
      query: (credentials: Auth) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<Response<null>, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "GET",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi;
