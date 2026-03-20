export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}


export class ProductNotFoundError extends HttpError {
  constructor() {
    super("Product not found", 404);
  }
}


export class ProductCreateFailed extends HttpError {
  constructor(message = "Product creation failed") {
    super(message, 500);
  }
}


export class ProductUpdateFailed extends HttpError {
  constructor(message = "Product update failed") {
    super(message, 500);
  }
}


export class ProductDeleteFailed extends HttpError {
  constructor() {
    super("Product deletion failed", 500);
  }
}


export class InvalidProductDataError extends HttpError {
  constructor(message = "Invalid product data") {
    super(message, 400);
  }
}


export class ProductPhotoAddFailed extends HttpError {
  constructor() {
    super("Failed to add product photo", 500);
  }
}