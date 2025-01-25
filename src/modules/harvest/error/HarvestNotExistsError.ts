import { HttpStatus } from '@nestjs/common';

import { HarvestErrorMessages } from '@shared/messages/error';
import { ApplicationError } from '@shared/types/ApplicationError';

export class HarvestNotExistsError extends ApplicationError {
  constructor() {
    const message = HarvestErrorMessages.HARVEST_NOT_EXISTS;
    const error = HarvestErrorMessages.HARVEST_NOT_EXISTS;
    const code = HttpStatus.NOT_FOUND;

    super(message, code, error);
  }
}
