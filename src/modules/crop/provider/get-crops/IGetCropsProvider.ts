import { Crop } from '@modules/crop/entity/Crop';

export interface IGetCropsProvider {
  getCrops(crops: Array<string>): Promise<Array<Crop>>;
}
