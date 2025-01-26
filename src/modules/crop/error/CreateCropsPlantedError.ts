import { HttpStatus } from '@nestjs/common';
import { CropErrorMessages } from '@shared/messages/error';
import { ApplicationError } from '@shared/types/ApplicationError';

export class CreateCropsPlantedError extends ApplicationError {
  constructor() {
    const message = CropErrorMessages.FAILURE_CRATE_CROPS_PLANTED;
    const error = CropErrorMessages.FAILURE_CRATE_CROPS_PLANTED;
    const code = HttpStatus.BAD_REQUEST;

    super(message, code, error);
  }
}
