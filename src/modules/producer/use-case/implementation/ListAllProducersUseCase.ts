import { Injectable } from '@nestjs/common';

import {
  IListAllProducersOutput,
  IListAllProducersUseCase,
} from '../IListAllProducersUseCase';
import { ProducerRepository } from '@modules/producer/repository/implementation/ProducerRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';

@Injectable()
export class ListAllProducersUseCase implements IListAllProducersUseCase {
  constructor(private readonly producerRepository: ProducerRepository) {}

  async execute(): Promise<IListAllProducersOutput> {
    const producers = await this.producerRepository.findAll({
      populate: [
        'ruralProperties',
        'ruralProperties.harvest',
        'ruralProperties.cropsPlanted.crop.*',
      ],
    });

    return buildSuccess(producers);
  }
}
