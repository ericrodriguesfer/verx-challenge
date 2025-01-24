import { Injectable } from '@nestjs/common';

import { CropRepository } from '@modules/crop/repository/implementation/CropRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';
import {
  IListAllCropsOutput,
  IListAllCropsUseCase,
} from '../IListAllCropsUseCase';

@Injectable()
export class ListAllCropsUseCase implements IListAllCropsUseCase {
  constructor(private readonly cropRepository: CropRepository) {}

  async execute(): Promise<IListAllCropsOutput> {
    const crops = await this.cropRepository.findAll();

    return buildSuccess(crops);
  }
}
