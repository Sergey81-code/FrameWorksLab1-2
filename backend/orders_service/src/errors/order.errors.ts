export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class OrderNotFoundError extends HttpError {
  constructor() {
    super("Order not found", 404);
  }
}

export class OrderCreateFailed extends HttpError {
  constructor(message = "Order creation failed") {
    super(message, 500);
  }
}

export class OrderUpdateFailed extends HttpError {
  constructor(message = "Order update failed") {
    super(message, 500);
  }
}

export class OrderDeleteFailed extends HttpError {
  constructor() {
    super("Order deletion failed", 500);
  }
}