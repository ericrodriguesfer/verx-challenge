import { EntityRepository } from '@mikro-orm/postgresql';

import { Crop } from '@modules/crop/entity/Crop';
import { Optional } from '@shared/types/Optional';
import { ICropRepository } from '../ICropRepository';

export class CropRepository
  extends EntityRepository<Crop>
  implements ICropRepository
{
  async findCropByUuid(uuid: string): Promise<Optional<Crop>> {
    const crop = await this.findOne({ uuid });

    return Optional.create<Crop>(crop as Crop);
  }
}
