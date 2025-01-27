/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';

import { HarvestRepository } from './HarvestRepository';
import { Harvest } from '@modules/harvest/entity/Harvest';

describe('[REPOSITORY] Harvest', () => {
  let harvestRepository: HarvestRepository;
  let entityManagerMock: jest.Mocked<EntityManager>;

  const mockHarvest = {
    id: 1,
    uuid: 'uuid',
    name: 'name',
    startDate: new Date(),
    endDate: new Date(),
  };

  beforeEach(async () => {
    entityManagerMock = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: HarvestRepository,
          useFactory: () => {
            const repo = new HarvestRepository(entityManagerMock, Harvest);
            jest
              .spyOn(repo, 'getEntityManager')
              .mockReturnValue(entityManagerMock);
            return repo;
          },
        },
      ],
    }).compile();

    harvestRepository = module.get(HarvestRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(harvestRepository).toBeDefined();
  });

  describe('findByUuid', () => {
    it('should return a harvest by UUID', async () => {
      const uuid = 'uuid';
      jest.spyOn(harvestRepository, 'findOne').mockResolvedValue(mockHarvest);

      const result = await harvestRepository.findByUuid(uuid);

      expect(harvestRepository.findOne).toHaveBeenCalled();
      expect(harvestRepository.findOne).toHaveBeenCalledTimes(1);
      expect(harvestRepository.findOne).toHaveBeenCalledWith({ uuid });
      expect(result.isEmpty()).toBeFalsy();
      expect(result.isPresent()).toBeTruthy();
      expect(result.get()).toEqual(mockHarvest);
    });

    it('should return an empty Optional when no harvest is found', async () => {
      const uuid = 'uuid';
      jest.spyOn(harvestRepository, 'findOne').mockResolvedValue(null);

      const result = await harvestRepository.findByUuid(uuid);

      expect(harvestRepository.findOne).toHaveBeenCalled();
      expect(harvestRepository.findOne).toHaveBeenCalledTimes(1);
      expect(harvestRepository.findOne).toHaveBeenCalledWith({ uuid });
      expect(result.isEmpty()).toBeTruthy();
      expect(result.isPresent()).toBeFalsy();
      expect(result.get()).toBeNull();
    });
  });
});
