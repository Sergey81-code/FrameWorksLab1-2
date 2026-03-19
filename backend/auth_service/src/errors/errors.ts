export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UserExistsError extends HttpError {
  constructor() {
    super("User already exists", 409); // HTTP 409 Conflict
  }
}

export class ValidationError extends HttpError {
  constructor(msg: string) {
    super(msg, 400);
  }
}

export class InvalidUsernameOrPasswordError extends HttpError {
  constructor() {
    super("Invalid username or password", 401);
  }
}

export class InvalidTokenError extends HttpError {
  constructor() {
    super("Invalid token", 401);
  }
}

export class ExpiredTokenError extends HttpError {
  constructor() {
    super("Refresh token expired", 401);
  }
}

export class UserNotFoundError extends HttpError {
  constructor() {
    super("User not found", 404);
  }
}

export class MissingTokenError extends HttpError {
  constructor() {
    super("Refresh token is missing", 400);
  }
}