import { HttpStatus } from '@nestjs/common';
import { RuralPropertieErrorMessages } from '@shared/messages/error';
import { ApplicationError } from '@shared/types/ApplicationError';

export class CreateRuralPropertieError extends ApplicationError {
  constructor() {
    const message = RuralPropertieErrorMessages.FAILURE_CRATE_PURAL_PROPERTIE;
    const error = RuralPropertieErrorMessages.FAILURE_CRATE_PURAL_PROPERTIE;
    const code = HttpStatus.NOT_FOUND;

    super(message, code, error);
  }
}
