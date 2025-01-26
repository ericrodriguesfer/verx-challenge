import { Optional } from '@shared/types/Optional';
import { Producer } from '../entity/Producer';

export interface IProducerRepository {
  findByUuid(uuid: string): Promise<Optional<Producer>>;
  findByCpfOrCnpj(cpfOrCnpj: string): Promise<Optional<Producer>>;
}
