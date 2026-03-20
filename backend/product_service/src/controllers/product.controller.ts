// controllers/product.controller.ts
import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponse,
} from "@lab1_2/types";

const getParamString = (param: string | string[] | undefined): string => {
  if (!param) throw new Error("Param is required");
  return Array.isArray(param) ? param[0] : param;
};

export const getAllProducts = async (_req: Request, res: Response) => {
  const products: ProductResponse[] = await ProductService.getProducts();
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const productId = getParamString(req.params.id);
  const product: ProductResponse = await ProductService.getProduct(productId);
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const data: CreateProductDto = req.body;
  const product: ProductResponse = await ProductService.createProduct(data);
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const productId = getParamString(req.params.id);
  const data: UpdateProductDto = req.body;
  const product: ProductResponse = await ProductService.updateProduct(
    productId,
    data
  );
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const productId = getParamString(req.params.id);
  await ProductService.deleteProduct(productId);
  res.json({ success: true });
};