import { HttpStatus } from '@nestjs/common';
import { ProducerErrorMessages } from '@shared/messages/error';
import { ApplicationError } from '@shared/types/ApplicationError';

export class CpfOrCnpjExistsError extends ApplicationError {
  constructor() {
    const message = ProducerErrorMessages.CPF_CNPJ_EXISTS;
    const error = ProducerErrorMessages.CPF_CNPJ_EXISTS;
    const code = HttpStatus.BAD_REQUEST;

    super(message, code, error);
  }
}
