import { Injectable } from '@nestjs/common';

import {
  IDeleteProducerInput,
  IDeleteProducerOutput,
  IDeleteProducerUseCase,
} from '../IDeleteProducerUseCase';
import { ProducerRepository } from '@modules/producer/repository/implementation/ProducerRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';
import { buildError } from '@shared/utils/buildError';
import { ProducerNotExistsError } from '@modules/producer/error/ProducerNotExistsError';

@Injectable()
export class DeleteProducerUseCase implements IDeleteProducerUseCase {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async execute({
    uuid,
  }: IDeleteProducerInput): Promise<IDeleteProducerOutput> {
    const producer = await this.producerRepository.findByUuid(uuid);

    if (producer.isEmpty()) {
      return buildError(new ProducerNotExistsError());
    }

    await this.producerRepository
      .getEntityManager()
      .removeAndFlush(producer.get());

    return buildSuccess(true);
  }
}
