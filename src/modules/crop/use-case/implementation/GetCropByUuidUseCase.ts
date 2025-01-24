import { Injectable } from '@nestjs/common';

import {
  IGetCropByUuidInput,
  IGetCropByUuidOutput,
  IGetCropByUuidUseCase,
} from '../IGetCropByUuidUseCase';
import { CropRepository } from '@modules/crop/repository/implementation/CropRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';
import { buildError } from '@shared/utils/buildError';
import { CropNotExistsError } from '@modules/crop/error/CropNotExistsError';

@Injectable()
export class GetCropByUuidUseCase implements IGetCropByUuidUseCase {
  constructor(private readonly cropRepository: CropRepository) {}

  async execute({ uuid }: IGetCropByUuidInput): Promise<IGetCropByUuidOutput> {
    const crop = await this.cropRepository.findCropByUuid(uuid);

    if (crop.isEmpty()) {
      return buildError(new CropNotExistsError());
    }

    return buildSuccess(crop.get());
  }
}
