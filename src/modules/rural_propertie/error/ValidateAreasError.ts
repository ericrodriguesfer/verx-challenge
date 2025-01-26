import { HttpStatus } from '@nestjs/common';
import { RuralPropertieErrorMessages } from '@shared/messages/error';
import { ApplicationError } from '@shared/types/ApplicationError';

export class ValidateAreasError extends ApplicationError {
  constructor() {
    const message = RuralPropertieErrorMessages.ERROR_VALIDATE_AREAS;
    const error = RuralPropertieErrorMessages.ERROR_VALIDATE_AREAS;
    const code = HttpStatus.NOT_FOUND;

    super(message, code, error);
  }
}
