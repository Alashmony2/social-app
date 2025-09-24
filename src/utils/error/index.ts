export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errorDetails?: object[]
  ) {
    super(message);
  }
}

export class ConflictException extends AppError {
  constructor(message: string,errorDetails?: object[]) {
    super(message, 409,errorDetails);
  }
}
export class NotFoundException extends AppError {
  constructor(message: string,errorDetails?: object[]) {
    super(message, 404,errorDetails);
  }
}
export class NotAuthorizedException extends AppError {
  constructor(message: string,errorDetails?: object[]) {
    super(message, 401,errorDetails);
  }
}
export class BadRequestException extends AppError {
  constructor(message: string,errorDetails?: object[]) {
    super(message, 400,errorDetails);
  }
}
export class ForbiddenException extends AppError {
  constructor(message: string,errorDetails?: object[]) {
    super(message, 403,errorDetails);
  }
}
