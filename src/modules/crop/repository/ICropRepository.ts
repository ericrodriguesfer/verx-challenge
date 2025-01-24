import { Optional } from '@shared/types/Optional';
import { Crop } from '../entity/Crop';

export interface ICropRepository {
  findCropByUuid(uuid: string): Promise<Optional<Crop>>;
}
