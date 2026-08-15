import { HttpException, type HttpStatus } from '@nestjs/common';

export class ProductException extends HttpException {
  constructor(status: HttpStatus, code: string, message: string) {
    super({ code, category: code.split('.')[0], message }, status);
  }
}
