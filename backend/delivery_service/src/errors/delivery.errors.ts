export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class DeliveryNotFoundError extends HttpError {
  constructor() {
    super("Delivery not found", 404);
  }
}

export class DeliveryCreateFailed extends HttpError {
  constructor(message = "Delivery creation failed") {
    super(message, 500);
  }
}

export class DeliveryUpdateFailed extends HttpError {
  constructor(message = "Delivery update failed") {
    super(message, 500);
  }
}

export class DeliveryDeleteFailed extends HttpError {
  constructor() {
    super("Delivery deletion failed", 500);
  }
}