import { baseApi } from "./baseApi";
import type {
  CreateDeliveryDto,
  DeliveryResponse,
  UpdateDeliveryDto,
} from "@lab1_2/types";

export const deliveryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliveries: builder.query<DeliveryResponse[], void>({
      query: () => "/deliveries",
      providesTags: ["Deliveries"],
    }),
    getDeliveryById: builder.query<DeliveryResponse, string>({
      query: (id) => `/deliveries/${id}`,
    }),
    createDelivery: builder.mutation<DeliveryResponse, CreateDeliveryDto>({
      query: (body) => ({
        url: "/deliveries",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deliveries"],
    }),
    updateDelivery: builder.mutation<
      DeliveryResponse,
      { id: string; data: UpdateDeliveryDto }
    >({
      query: ({ id, data }) => ({
        url: `/deliveries/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Deliveries"],
    }),
  }),
});

export const {
  useGetDeliveriesQuery,
  useGetDeliveryByIdQuery,
  useCreateDeliveryMutation,
  useUpdateDeliveryMutation,
} = deliveryApi;