import {
  ProductNotFoundError,
  ProductCreateFailed,
  ProductUpdateFailed,
  ProductDeleteFailed
} from "../errors/product.errors"

import * as ProductRepository from "../repositories/product.repository"
import * as ProductPhotoRepository from "../repositories/product_photo.repository"

import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponse
} from "@lab1_2/types"


const toProductResponse = (product: any, photos: string[] = []): ProductResponse => ({
  id: product.id,
  name: product.name,
  category_id: product.category_id,
  price: Number(product.price),
  discount: Number(product.discount),
  quantity: product.quantity,
  description: product.description,
  is_active: product.is_active,
  created_at: product.created_at,
  photos
})


export const createProduct = async (data: CreateProductDto) => {
  const { name, price, quantity} = data

  if (price < 0) {
    throw new ProductCreateFailed("Invalid price")
  }

  if (quantity < 0) {
    throw new ProductCreateFailed("Invalid quantity")
  }

  if (data.discount && data.discount > 100) {
    throw new ProductCreateFailed("Invalid discount")
  }

  const product = await ProductRepository.createProduct(data)

  if (!product) {
    throw new ProductCreateFailed()
  }

  return toProductResponse(product)
}


export const getProduct = async (productId: string) => {
  const product = await ProductRepository.findById(productId)

  if (!product) {
    throw new ProductNotFoundError()
  }

  const photos = await ProductPhotoRepository.getPhotos(productId)

  return toProductResponse(product, photos)
}


export const getProducts = async () => {
  const products = await ProductRepository.findAll()

  return products.map((p: any) =>
    toProductResponse(p)
  )
}


export const updateProduct = async (
  productId: string,
  data: UpdateProductDto
) => {
  const product = await ProductRepository.findById(productId)

  if (!product) {
    throw new ProductNotFoundError()
  }

  if (data.price !== undefined && data.price < 0) {
    throw new ProductUpdateFailed("Invalid price")
  }

  if (data.quantity !== undefined && data.quantity < 0) {
    throw new ProductUpdateFailed("Invalid quantity")
  }

  const updated = await ProductRepository.updateProduct(productId, data)

  if (!updated) {
    throw new ProductUpdateFailed()
  }

  return toProductResponse(updated)
}


export const addProductPhoto = async (
  productId: string,
  url: string
) => {
  const product = await ProductRepository.findById(productId)

  if (!product) {
    throw new ProductNotFoundError()
  }

  const photo = await ProductPhotoRepository.addPhoto(productId, url)

  if (!photo) {
    throw new ProductUpdateFailed("Photo not added")
  }

  return photo
}


export const deleteProduct = async (productId: string) => {
  const product = await ProductRepository.findById(productId)

  if (!product) {
    throw new ProductNotFoundError()
  }

  const deleted = await ProductRepository.deleteProduct(productId)

  if (!deleted) {
    throw new ProductDeleteFailed()
  }

  return deleted
}