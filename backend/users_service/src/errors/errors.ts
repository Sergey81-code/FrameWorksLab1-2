export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UserNotFoundError extends HttpError {
  constructor() {
    super("User not found", 404);
  }
}

export class UserExistsError extends HttpError {
  constructor() {
    super("User already exists", 409);
  }
}

export class UserUpdateFailed extends HttpError {
      constructor() {
    super("User update failed", 500);
  }
}

export class UserDeleteFailed extends HttpError {
      constructor() {
    super("User deletion failed", 500);
  }
}

