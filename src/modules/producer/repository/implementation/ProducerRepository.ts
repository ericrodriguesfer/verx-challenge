import { EntityRepository } from '@mikro-orm/postgresql';

import { Producer } from '@modules/producer/entity/Producer';
import { Optional } from '@shared/types/Optional';
import { IProducerRepository } from '../IProducerRepository';

export class ProducerRepository
  extends EntityRepository<Producer>
  implements IProducerRepository
{
  async findByUuid(uuid: string): Promise<Optional<Producer>> {
    const producer = await this.findOne({ uuid });

    return Optional.create<Producer>(producer as Producer);
  }

  async findByCpfOrCnpj(cpfOrCnpj: string): Promise<Optional<Producer>> {
    const producer = await this.findOne({ cprOrCnpj: cpfOrCnpj });

    return Optional.create<Producer>(producer as Producer);
  }
}
