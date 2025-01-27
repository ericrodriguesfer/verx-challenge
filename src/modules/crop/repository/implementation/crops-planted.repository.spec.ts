/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { EntityManager, QueryBuilder } from '@mikro-orm/postgresql';

import { CropsPlantedRepository } from './CropsPlantedRepository';
import { CropsPlanted } from '@modules/crop/entity/CropsPlanted';

describe('[REPOSITORY] CropsPlanted', () => {
  let cropsPlantedRepository: CropsPlantedRepository;
  let entityManagerMock: jest.Mocked<EntityManager>;
  let queryBuilderMock: jest.Mocked<QueryBuilder<CropsPlanted>>;

  beforeEach(async () => {
    queryBuilderMock = {
      delete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    } as unknown as jest.Mocked<QueryBuilder<CropsPlanted>>;

    entityManagerMock = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
    } as unknown as jest.Mocked<EntityManager>;

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: CropsPlantedRepository,
          useFactory: () => {
            const repo = new CropsPlantedRepository(
              entityManagerMock,
              CropsPlanted,
            );
            jest
              .spyOn(repo, 'getEntityManager')
              .mockReturnValue(entityManagerMock);
            return repo;
          },
        },
      ],
    }).compile();

    cropsPlantedRepository = module.get(CropsPlantedRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(cropsPlantedRepository).toBeDefined();
  });

  describe('deleteCropsPlantedByRuralPropertieUuid', () => {
    it('should delete crops planted by rural property UUID and return true', async () => {
      const uuid = 'uuid';

      const result =
        await cropsPlantedRepository.deleteCropsPlantedByRuralPropertieUuid(
          uuid,
        );

      expect(entityManagerMock.createQueryBuilder).toHaveBeenCalled();
      expect(entityManagerMock.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(entityManagerMock.createQueryBuilder).toHaveBeenCalledWith(
        CropsPlanted,
      );
      expect(queryBuilderMock.delete).toHaveBeenCalled();
      expect(queryBuilderMock.delete).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.where).toHaveBeenCalled();
      expect(queryBuilderMock.where).toHaveBeenCalledTimes(1);
      expect(queryBuilderMock.where).toHaveBeenCalledWith({
        ruralPropertie: { uuid },
      });
      expect(result.isEmpty()).toBeFalsy();
      expect(result.isPresent()).toBeTruthy();
      expect(result.get()).toEqual(true);
    });
  });
});
