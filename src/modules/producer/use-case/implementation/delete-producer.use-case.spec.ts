/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';

import { DeleteProducerUseCase } from './DeleteProducerUseCase';
import { ProducerRepository } from '@modules/producer/repository/implementation/ProducerRepository';
import { Optional } from '@shared/types/Optional';
import { buildError } from '@shared/utils/buildError';
import { Producer } from '@modules/producer/entity/Producer';
import { ProducerNotExistsError } from '@modules/producer/error/ProducerNotExistsError';
import { buildSuccess } from '@shared/utils/buildSuccess';
import { ApplicationError } from '@shared/types/ApplicationError';

describe('[USE-CASE] DeleteProducer', () => {
  let deleteProducerUseCase: DeleteProducerUseCase;
  let producerRepository: jest.Mocked<ProducerRepository>;
  let entityManagerMock: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    entityManagerMock = {
      removeAndFlush: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProducerUseCase,
        {
          provide: ProducerRepository,
          useValue: {
            findByUuid: jest.fn(),
            getEntityManager: jest.fn(() => entityManagerMock),
          },
        },
      ],
    }).compile();

    deleteProducerUseCase = module.get<DeleteProducerUseCase>(
      DeleteProducerUseCase,
    );
    producerRepository = module.get(ProducerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined use case', () => {
    expect(deleteProducerUseCase).toBeDefined();
  });

  it('should return an error if the producer does not exist', async () => {
    const uuid = 'uuid';
    jest
      .spyOn(producerRepository, 'findByUuid')
      .mockResolvedValueOnce(Optional.create(null!));

    const result = await deleteProducerUseCase.execute({ uuid });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(entityManagerMock.removeAndFlush).not.toHaveBeenCalled();
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new ProducerNotExistsError()));
  });

  it('should delete the producer and return success if the producer exists', async () => {
    const uuid = 'uuid';
    const producer = new Producer();
    producer.uuid = uuid;

    jest
      .spyOn(producerRepository, 'findByUuid')
      .mockResolvedValueOnce(Optional.create<Producer>(producer));
    jest
      .spyOn(entityManagerMock, 'removeAndFlush')
      .mockResolvedValueOnce(undefined);

    const result = await deleteProducerUseCase.execute({ uuid });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(entityManagerMock.removeAndFlush).toHaveBeenCalled();
    expect(entityManagerMock.removeAndFlush).toHaveBeenCalledTimes(1);
    expect(entityManagerMock.removeAndFlush).toHaveBeenCalledWith(producer);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).not.toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildSuccess(true));
  });
});
