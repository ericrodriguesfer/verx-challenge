/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ListAllProducersUseCase } from './ListAllProducersUseCase';
import { ProducerRepository } from '@modules/producer/repository/implementation/ProducerRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';

describe('[USE-CASE] ListAllProducers', () => {
  let listAllProducersUseCase: ListAllProducersUseCase;
  let producerRepository: jest.Mocked<ProducerRepository>;

  const mockProducer = {
    id: 1,
    name: 'name',
    cpfOrCnpj: '12345678901',
    ruralProperties: [
      {
        id: 1,
        name: 'name',
        harvest: {
          id: 1,
          name: 'name',
        },
        cropsPlanted: [
          {
            crop: {
              id: 1,
              name: 'name',
            },
          },
        ],
      },
    ],
  };

  const mockProducers = [mockProducer];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAllProducersUseCase,
        {
          provide: ProducerRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockProducers),
          },
        },
      ],
    }).compile();

    listAllProducersUseCase = module.get<ListAllProducersUseCase>(
      ListAllProducersUseCase,
    );
    producerRepository = module.get(ProducerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined use case', () => {
    expect(listAllProducersUseCase).toBeDefined();
  });

  it('should return a list of producers with their related data', async () => {
    const result = await listAllProducersUseCase.execute();

    expect(producerRepository.findAll).toHaveBeenCalled();
    expect(producerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(producerRepository.findAll).toHaveBeenCalledWith({
      populate: [
        'ruralProperties',
        'ruralProperties.harvest',
        'ruralProperties.cropsPlanted.crop.*',
      ],
    });
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).toHaveLength(mockProducers.length);
    expect(result).toEqual(buildSuccess(mockProducers));
  });

  it('should return an empty list if no producers are found', async () => {
    producerRepository.findAll.mockResolvedValueOnce([]);
    const result = await listAllProducersUseCase.execute();

    expect(producerRepository.findAll).toHaveBeenCalled();
    expect(producerRepository.findAll).toHaveBeenCalledTimes(1);
    expect(producerRepository.findAll).toHaveBeenCalledWith({
      populate: [
        'ruralProperties',
        'ruralProperties.harvest',
        'ruralProperties.cropsPlanted.crop.*',
      ],
    });
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).toHaveLength(0);
    expect(result).toEqual(buildSuccess([]));
  });
});
