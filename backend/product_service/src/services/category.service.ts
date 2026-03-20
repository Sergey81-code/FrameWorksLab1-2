import { CategoryCreateFailed, CategoryDeleteFailed, CategoryNotFoundError, CategoryUpdateFailed } from "../errors/category.errors";
import * as CategoryRepository from "../repositories/category.repository";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto
} from "@lab1_2/types";

export const toCategoryResponse = (cat: any): CategoryResponseDto => ({
  id: cat.id,
  name: cat.name,
  parent_id: cat.parent_id
});

export const getCategories = async () => {
  const categories = await CategoryRepository.findAll();
  return categories.map(toCategoryResponse);
};

export const getCategory = async (id: string) => {
  const category = await CategoryRepository.findById(id);
  if (!category) throw new CategoryNotFoundError();
  return toCategoryResponse(category);
};

export const createCategory = async (data: CreateCategoryDto) => {
  const category = await CategoryRepository.createCategory(data);
  if (!category) throw new CategoryCreateFailed();
  return toCategoryResponse(category);
};

export const updateCategory = async (id: string, data: UpdateCategoryDto) => {
  const category = await CategoryRepository.findById(id);
  if (!category) throw new CategoryNotFoundError();
  const updated = await CategoryRepository.updateCategory(id, data);
  if (!updated) throw new CategoryUpdateFailed();
  return toCategoryResponse(updated);
};

export const deleteCategory = async (id: string) => {
  const category = await CategoryRepository.findById(id);
  if (!category) throw new CategoryNotFoundError();
  const deleted = await CategoryRepository.deleteCategory(id);
  if (!deleted) throw new CategoryDeleteFailed();
  return deleted;
};