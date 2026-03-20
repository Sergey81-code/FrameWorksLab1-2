import { Request, Response } from "express";
import * as ProductPhotoService from "../services/product_photo.service";

const getParamString = (param: string | string[] | undefined): string => {
  if (!param) throw new Error("Param is required");
  return Array.isArray(param) ? param[0] : param;
};

export const getPhotos = async (req: Request, res: Response) => {
  const productId = getParamString(req.params.productId);
  const photos = await ProductPhotoService.getProductPhotos(productId);
  res.json(photos);
};

export const addPhoto = async (req: Request, res: Response) => {
  const productId = getParamString(req.params.productId);
  const { url } = req.body;
  const photo = await ProductPhotoService.addProductPhoto(productId, url);
  res.json(photo);
};

export const deletePhoto = async (req: Request, res: Response) => {
  const photoId = getParamString(req.params.photoId);
  await ProductPhotoService.deleteProductPhoto(photoId);
  res.json({ success: true });
};