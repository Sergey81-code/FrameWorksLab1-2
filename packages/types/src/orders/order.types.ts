export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: "pending" | "paid" | "shipped" | "completed" | "canceled";
  total: number;
  created_at: Date;
  items: OrderItem[];
}

export interface CreateOrderItemDto {
  product_id: string;
  quantity: number;
}

export interface CreateOrderDto {
  user_id: string;
  items: CreateOrderItemDto[];
}

export interface UpdateOrderDto {
  status?: "pending" | "paid" | "shipped" | "completed" | "canceled";
}

export interface OrderResponse {
  id: string;
  user_id: string;
  status: string;
  total: number;
  created_at: string;
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
}