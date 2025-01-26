import { HttpStatus } from '@nestjs/common';
import { CropErrorMessages } from '@shared/messages/error';
import { ApplicationError } from '@shared/types/ApplicationError';

export class SomeCropNotExistsError extends ApplicationError {
  constructor() {
    const message = CropErrorMessages.SOME_CROP_NOT_EXISTS;
    const error = CropErrorMessages.SOME_CROP_NOT_EXISTS;
    const code = HttpStatus.NOT_FOUND;

    super(message, code, error);
  }
}
