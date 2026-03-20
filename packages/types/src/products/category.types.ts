export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

export interface CreateCategoryDto {
  name: string;
  parent_id?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  parent_id?: string | null;
}

export interface CategoryResponseDto {
  id: string;
  name: string;
  parent_id: string | null;
}