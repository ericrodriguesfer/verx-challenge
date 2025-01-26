import { Optional } from '@shared/types/Optional';
import { Harvest } from '../entity/Harvest';

export interface IHarvestRepository {
  findByUuid(uuid: string): Promise<Optional<Harvest>>;
}
