import { Injectable } from '@nestjs/common';
import { IValidateCropsProvider } from '../IValidateCropsProvider';
import { Crop } from '@modules/crop/entity/Crop';

@Injectable()
export class ValidateCropsProvider implements IValidateCropsProvider {
  public validateCrops(
    crops: Array<string>,
    cropsSearching: Array<Crop>,
  ): boolean {
    return crops.length !== cropsSearching.length;
  }
}
