import { baseApi } from "./baseApi";
import type { LoginDto, RegisterDto, Tokens } from "@lab1_2/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<Tokens, RegisterDto>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<Tokens, LoginDto>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    refresh: builder.mutation<Tokens, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshMutation,
} = authApi;