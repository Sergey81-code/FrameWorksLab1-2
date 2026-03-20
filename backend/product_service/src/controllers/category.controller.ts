import { Request, Response } from "express";
import * as CategoryService from "../services/category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "@lab1_2/types";

const getParamString = (param: string | string[] | undefined): string => {
  if (!param) throw new Error("Param is required");
  return Array.isArray(param) ? param[0] : param;
};

export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await CategoryService.getCategories();
  res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const categoryId = getParamString(req.params.id);
  const category = await CategoryService.getCategory(categoryId);
  res.json(category);
};

export const createCategory = async (req: Request, res: Response) => {
  const data: CreateCategoryDto = req.body;
  const category = await CategoryService.createCategory(data);
  res.json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const categoryId = getParamString(req.params.id);
  const data: UpdateCategoryDto = req.body;
  const category = await CategoryService.updateCategory(categoryId, data);
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const categoryId = getParamString(req.params.id);
  await CategoryService.deleteCategory(categoryId);
  res.json({ success: true });
};