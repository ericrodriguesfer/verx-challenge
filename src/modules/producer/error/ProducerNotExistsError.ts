import { HttpStatus } from '@nestjs/common';
import { ProducerErrorMessages } from '@shared/messages/error';
import { ApplicationError } from '@shared/types/ApplicationError';

export class ProducerNotExistsError extends ApplicationError {
  constructor() {
    const message = ProducerErrorMessages.PRODUCER_NOT_EXISTS;
    const error = ProducerErrorMessages.PRODUCER_NOT_EXISTS;
    const code = HttpStatus.NOT_FOUND;

    super(message, code, error);
  }
}
