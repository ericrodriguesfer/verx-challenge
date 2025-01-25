import { Optional } from '@shared/types/Optional';
import { Harvest } from '../entity/Harvest';

export interface IHarvestRepository {
  findById(id: number): Promise<Optional<Harvest>>;
}
