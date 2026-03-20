export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ProductPhotoAddFailed extends HttpError {
  constructor() {
    super("Failed to add product photo", 500);
  }
}

export class ProductPhotoDeleteFailed extends HttpError {
  constructor() {
    super("Photo deletion failed", 500);
  }
}