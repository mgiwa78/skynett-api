export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Route not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Found" }];
  }
}

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public reason: string) {
    super(reason);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connecting to the database";

  constructor() {
    super("Database connection error");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

export class ValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: { message: string; field?: string }[]) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    return this.errors;
  }
}

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super("Not authorized to access this resource");
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Unauthorized" }];
  }
}
