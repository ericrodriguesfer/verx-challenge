import { Crop } from '@modules/crop/entity/Crop';

export interface IValidateCropsProvider {
  validateCrops(crops: Array<string>, cropsSearching: Array<Crop>): boolean;
}
