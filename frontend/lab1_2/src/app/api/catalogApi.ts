import { baseApi } from "./baseApi";
import type {
  CategoryResponseDto,
  ProductPhotoResponseDto,
  ProductResponse,
} from "@lab1_2/types";

export const catalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponseDto[], void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    getProducts: builder.query<ProductResponse[], void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),
    getProductById: builder.query<ProductResponse, string>({
      query: (id) => `/products/${id}`,
    }),
    getProductPhotos: builder.query<ProductPhotoResponseDto[], string>({
      query: (productId) => `/product-photos/${productId}`,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductPhotosQuery,
} = catalogApi;