export interface ProductPhoto {
  id: string;
  product_id: string;
  url: string;
}

export interface CreateProductPhotoDto {
  product_id: string;
  url: string;
}

export interface ProductPhotoResponseDto {
  id: string;
  url: string;
}

