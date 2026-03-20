export interface Delivery {
  id: string;
  order_id: string;
  address: string;
  status: string;
  delivery_date: Date | null;
  created_at: Date;
}

export interface CreateDeliveryDto {
  order_id: string;
  address: string;
  delivery_date?: Date;
}

export interface UpdateDeliveryDto {
  address?: string;
  status?: "pending" | "in_transit" | "delivered" | "canceled";
  delivery_date?: Date | null;
}

export interface DeliveryResponse {
  id: string;
  order_id: string;
  address: string;
  status: string;
  delivery_date: string | null;
  created_at: string;
}