import { baseApi } from "./baseApi";
import type { UpdateUserDto, UserResponse } from "@lab1_2/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserResponse, void>({
      query: () => "/users/me",
      providesTags: ["Me"],
    }),
    updateMe: builder.mutation<UserResponse, UpdateUserDto>({
      query: (body) => ({
        url: "/users/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    updateAvatar: builder.mutation<UserResponse, { avatar: string }>({
      query: (body) => ({
        url: "/users/me/avatar",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    deleteMe: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUpdateAvatarMutation,
  useDeleteMeMutation,
} = userApi;