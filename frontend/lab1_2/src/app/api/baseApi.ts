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

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  prepareHeaders: (headers, { getState }) => {
    const token =
      (getState() as RootState).auth.accessToken ||
      localStorage.getItem("accessToken");

    if (token) headers.set("authorization", `Bearer ${token}`);
    headers.set("content-type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken =
      (api.getState() as RootState).auth.refreshToken ||
      localStorage.getItem("refreshToken");

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: "/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data && typeof refreshResult.data === "object") {
        api.dispatch(
          setCredentials(refreshResult.data as {
            accessToken: string;
            refreshToken: string;
          })
        );
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
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Me", "Categories", "Products", "Orders", "Deliveries"],
  endpoints: () => ({}),
});