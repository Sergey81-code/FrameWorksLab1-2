import type { ProductResponse } from "@lab1_2/types";


export interface CartItem {
  product: ProductResponse;
  quantity: number;
}