export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class CategoryNotFoundError extends HttpError {
  constructor() {
    super("Category not found", 404);
  }
}

export class CategoryCreateFailed extends HttpError {
      constructor() {
    super("Category creation failed", 500);
  }
}

export class CategoryUpdateFailed extends HttpError {
      constructor() {
    super("Category update failed", 500);
  }
}

export class CategoryDeleteFailed extends HttpError {
      constructor() {
    super("Category deletion failed", 500);
  }
}
