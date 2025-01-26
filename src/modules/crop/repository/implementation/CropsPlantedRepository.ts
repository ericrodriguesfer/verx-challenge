import { EntityRepository } from '@mikro-orm/postgresql';

import { CropsPlanted } from '@modules/crop/entity/CropsPlanted';
import { ICropsPlantedRepository } from '../ICropsPlantedRepository';
import { Optional } from '@shared/types/Optional';

export class CropsPlantedRepository
  extends EntityRepository<CropsPlanted>
  implements ICropsPlantedRepository
{
  async deleteCropsPlantedByRuralPropertieUuid(
    uuid: string,
  ): Promise<Optional<boolean>> {
    const queryBuilder =
      this.getEntityManager().createQueryBuilder(CropsPlanted);

    await queryBuilder.delete().where({ ruralPropertie: { uuid } });

    return Optional.create<boolean>(true);
  }
}
