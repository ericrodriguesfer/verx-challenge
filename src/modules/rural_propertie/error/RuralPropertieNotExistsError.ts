import { HttpStatus } from '@nestjs/common';
import { RuralPropertieErrorMessages } from '@shared/messages/error';
import { ApplicationError } from '@shared/types/ApplicationError';

export class RuralPropertieNotExistsError extends ApplicationError {
  constructor() {
    const message = RuralPropertieErrorMessages.RURAL_PROPERTIE_NOT_EXISTS;
    const error = RuralPropertieErrorMessages.RURAL_PROPERTIE_NOT_EXISTS;
    const code = HttpStatus.NOT_FOUND;

    super(message, code, error);
  }
}
