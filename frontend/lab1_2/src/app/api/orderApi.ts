import { baseApi } from "./baseApi";
import type {
  CreateOrderDto,
  OrderResponse,
  UpdateOrderDto,
} from "@lab1_2/types";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrdersByUser: builder.query<OrderResponse[], string>({
      query: (userId) => `/orders/user/${userId}`,
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<OrderResponse, string>({
      query: (id) => `/orders/${id}`,
    }),
    createOrder: builder.mutation<OrderResponse, CreateOrderDto>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateOrder: builder.mutation<
      OrderResponse,
      { id: string; data: UpdateOrderDto }
    >({
      query: ({ id, data }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersByUserQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
} = orderApi;