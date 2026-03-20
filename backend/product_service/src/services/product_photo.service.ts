import { ProductNotFoundError, ProductPhotoAddFailed } from "../errors/product.errors";
import { ProductPhotoDeleteFailed } from "../errors/product_photo.errors";
import * as ProductRepository from "../repositories/product.repository";
import * as ProductPhotoRepository from "../repositories/product_photo.repository";



export const getProductPhotos = async (productId: string) => {
  const product = await ProductRepository.findById(productId);
  if (!product) throw new ProductNotFoundError();
  return await ProductPhotoRepository.getPhotos(productId);
};

export const addProductPhoto = async (productId: string, url: string) => {
  const product = await ProductRepository.findById(productId);
  if (!product) throw new ProductNotFoundError();
  const photo = await ProductPhotoRepository.addPhoto(productId, url);
  if (!photo) throw new ProductPhotoAddFailed();
  return photo;
};

export const deleteProductPhoto = async (photoId: string) => {
  const deleted = await ProductPhotoRepository.deletePhoto(photoId);
  if (!deleted) throw new ProductPhotoDeleteFailed();
  return deleted;
};