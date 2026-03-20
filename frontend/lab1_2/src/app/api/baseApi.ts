import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "../store";
import { logout, setCredentials } from "../slices/authSlice";
import type { Tokens } from "@lab1_2/types";


const getBaseUrl = (url: string) => {
  if (url.startsWith("/auth")) return import.meta.env.VITE_AUTH_API;
  if (url.startsWith("/users")) return import.meta.env.VITE_USER_API;
  if (url.startsWith("/categories") || url.startsWith("/products") || url.startsWith("/product-photos"))
    return import.meta.env.VITE_CATALOG_API;
  if (url.startsWith("/orders")) return import.meta.env.VITE_ORDER_API;
  if (url.startsWith("/deliveries")) return import.meta.env.VITE_DELIVERY_API;

  return import.meta.env.VITE_AUTH_API;
};

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;

  const token = state.auth.accessToken || localStorage.getItem("accessToken");

  const rawBaseQuery = fetchBaseQuery({
    baseUrl: getBaseUrl(typeof args === "string" ? args : args.url),
    prepareHeaders: (headers) => {
      if (token) headers.set("authorization", `Bearer ${token}`);
      headers.set("content-type", "application/json");
      return headers;
    },
  });

  let result = await rawBaseQuery(args, api, extraOptions);


  if (result.error?.status === 401) {
    const refreshToken =
      state.auth.refreshToken || localStorage.getItem("refreshToken");

    if (refreshToken) {
      const refreshBaseQuery = fetchBaseQuery({
        baseUrl: import.meta.env.VITE_AUTH_API,
      });

      const refreshResult = await refreshBaseQuery(
        {
          url: "/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const tokens = refreshResult.data as Tokens;

        api.dispatch(setCredentials(tokens));

        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["Me", "Categories", "Products", "Orders", "Deliveries"],
  endpoints: () => ({}),
});