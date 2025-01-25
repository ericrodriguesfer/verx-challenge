import { Harvest } from '@modules/harvest/entity/Harvest';
import { Optional } from '@shared/types/Optional';
import { IHarvestRepository } from '../IHarvestRepository';
import { EntityRepository } from '@mikro-orm/postgresql';

export class HarvestRepository
  extends EntityRepository<Harvest>
  implements IHarvestRepository
{
  async findById(id: number): Promise<Optional<Harvest>> {
    const harvest = await this.findOne({ id });

    return Optional.create<Harvest>(harvest as Harvest);
  }
}
