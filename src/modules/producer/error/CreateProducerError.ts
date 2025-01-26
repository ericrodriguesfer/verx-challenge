import { HttpStatus } from '@nestjs/common';
import { ProducerErrorMessages } from '@shared/messages/error';
import { ApplicationError } from '@shared/types/ApplicationError';

export class CreateProducerError extends ApplicationError {
  constructor() {
    const message = ProducerErrorMessages.FAILURE_CRATE_PRODUCER;
    const error = ProducerErrorMessages.FAILURE_CRATE_PRODUCER;
    const code = HttpStatus.BAD_REQUEST;

    super(message, code, error);
  }
}
