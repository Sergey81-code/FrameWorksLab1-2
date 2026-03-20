export interface Product {
  id: string;
  name: string;
  category_id: string | null;
  price: string;
  discount: string;
  quantity: number;
  description: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface CreateProductDto {
  name: string;
  category_id?: string;
  price: number;
  discount?: number;
  quantity: number;
  description?: string;
}

export interface UpdateProductDto {
  name?: string;
  category_id?: string | null;
  price?: number;
  discount?: number;
  quantity?: number;
  description?: string | null;
  is_active?: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  category_id: string | null;
  price: number;
  discount: number;
  quantity: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  photos: string[];
}