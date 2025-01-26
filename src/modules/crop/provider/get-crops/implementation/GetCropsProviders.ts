import { Crop } from '@modules/crop/entity/Crop';
import { IGetCropsProvider } from '../IGetCropsProvider';
import { Injectable } from '@nestjs/common';
import { CropRepository } from '@modules/crop/repository/implementation/CropRepository';

@Injectable()
export class GetCropsProvider implements IGetCropsProvider {
  constructor(private readonly cropRepository: CropRepository) {}

  public async getCrops(crops: Array<string>): Promise<Array<Crop>> {
    const cropsSearching = await this.cropRepository.find({
      uuid: { $in: crops },
    });

    return cropsSearching;
  }
}
