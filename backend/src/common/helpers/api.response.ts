import { HttpStatus, Injectable } from '@nestjs/common';

const DEFAULT_SUCCESS_MESSAGE = 'Success';

@Injectable()
export class ApiResponse<T> {
  public code: number;
  public message: string;
  public data: T;
  public errors: T;
}

export class SuccessResponse {
  constructor(data = {}, message = DEFAULT_SUCCESS_MESSAGE) {
    return {
      code: HttpStatus.OK,
      message,
      data,
      version: process.env.VERSION || '0.0.1',
    };
  }
}

export interface IErrorResponse {
  key: string;
  errorCode: number;
  message: string;
}

export class ErrorResponse {
  constructor(
    code = HttpStatus.INTERNAL_SERVER_ERROR,
    message = '',
    errors: IErrorResponse[] = [],
  ) {
    return {
      code,
      message,
      errors,
      version: process.env.VERSION || '0.0.1',
    };
  }
}
