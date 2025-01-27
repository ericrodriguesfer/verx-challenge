/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';

import { ProducerRepository } from './ProducerRepository';
import { Producer } from '@modules/producer/entity/Producer';

describe('[REPOSITORY] Producer', () => {
  let producerRepository: ProducerRepository;
  let entityManagerMock: jest.Mocked<EntityManager>;

  const mockProducer = {
    id: 1,
    uuid: 'uuid',
    name: 'name',
    cprOrCnpj: '12345678901',
  };

  beforeEach(async () => {
    entityManagerMock = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: ProducerRepository,
          useFactory: () => {
            const repo = new ProducerRepository(entityManagerMock, Producer);
            jest
              .spyOn(repo, 'getEntityManager')
              .mockReturnValue(entityManagerMock);
            return repo;
          },
        },
      ],
    }).compile();

    producerRepository = module.get(ProducerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(producerRepository).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should return a producer by UUID', async () => {
      const uuid = 'uuid';
      jest.spyOn(producerRepository, 'findOne').mockResolvedValue(mockProducer);

      const result = await producerRepository.findByUuid(uuid);

      expect(producerRepository.findOne).toHaveBeenCalled();
      expect(producerRepository.findOne).toHaveBeenCalledTimes(1);
      expect(producerRepository.findOne).toHaveBeenCalledWith({ uuid });
      expect(result.isEmpty()).toBeFalsy();
      expect(result.isPresent()).toBeTruthy();
      expect(result.get()).toEqual(mockProducer);
    });

    it('should return an empty Optional when no producer is found', async () => {
      const uuid = 'uuid';
      jest.spyOn(producerRepository, 'findOne').mockResolvedValue(null);

      const result = await producerRepository.findByUuid(uuid);

      expect(producerRepository.findOne).toHaveBeenCalled();
      expect(producerRepository.findOne).toHaveBeenCalledTimes(1);
      expect(producerRepository.findOne).toHaveBeenCalledWith({ uuid });
      expect(result.isEmpty()).toBeTruthy();
      expect(result.isPresent()).toBeFalsy();
      expect(result.get()).toBeNull();
    });
  });

  describe('findByCpfOrCnpj', () => {
    it('should return a producer by CPF or CNPJ', async () => {
      const cpfOrCnpj = '12345678901';
      jest.spyOn(producerRepository, 'findOne').mockResolvedValue(mockProducer);

      const result = await producerRepository.findByCpfOrCnpj(cpfOrCnpj);

      expect(producerRepository.findOne).toHaveBeenCalled();
      expect(producerRepository.findOne).toHaveBeenCalledTimes(1);
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        cprOrCnpj: cpfOrCnpj,
      });
      expect(result.isEmpty()).toBeFalsy();
      expect(result.isPresent()).toBeTruthy();
      expect(result.get()).toEqual(mockProducer);
    });

    it('should return an empty Optional when no producer is found', async () => {
      const cpfOrCnpj = '12345678901';
      jest.spyOn(producerRepository, 'findOne').mockResolvedValue(null);

      const result = await producerRepository.findByCpfOrCnpj(cpfOrCnpj);

      expect(producerRepository.findOne).toHaveBeenCalled();
      expect(producerRepository.findOne).toHaveBeenCalledTimes(1);
      expect(producerRepository.findOne).toHaveBeenCalledWith({
        cprOrCnpj: cpfOrCnpj,
      });
      expect(result.isEmpty()).toBeTruthy();
      expect(result.isPresent()).toBeFalsy();
      expect(result.get()).toBeNull();
    });
  });
});
