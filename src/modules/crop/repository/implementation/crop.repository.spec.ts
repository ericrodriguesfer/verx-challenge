/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';

import { CropRepository } from './CropRepository';
import { Crop } from '@modules/crop/entity/Crop';

describe('[REPOSITORY] Crop', () => {
  let cropRepository: CropRepository;
  let entityManagerMock: jest.Mocked<EntityManager>;

  const mockCrop = {
    id: 1,
    uuid: 'uuid',
    name: 'name',
  };

  beforeEach(async () => {
    entityManagerMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: CropRepository,
          useFactory: () => {
            const repo = new CropRepository(entityManagerMock, Crop);
            jest
              .spyOn(repo, 'getEntityManager')
              .mockReturnValue(entityManagerMock);
            return repo;
          },
        },
      ],
    }).compile();

    cropRepository = module.get(CropRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(cropRepository).toBeDefined();
  });

  describe('findCropByUuid', () => {
    it('should return a crop by UUID', async () => {
      jest.spyOn(cropRepository, 'findOne').mockResolvedValue(mockCrop as Crop);

      const result = await cropRepository.findCropByUuid('uuid');

      expect(cropRepository.findOne).toHaveBeenCalled();
      expect(cropRepository.findOne).toHaveBeenCalledTimes(1);
      expect(cropRepository.findOne).toHaveBeenCalledWith({
        uuid: 'uuid',
      });
      expect(result.isEmpty()).toBeFalsy();
      expect(result.isPresent()).toBeTruthy();
      expect(result.get()).toEqual(mockCrop);
    });

    it('should return an empty Optional when no crop is found', async () => {
      jest.spyOn(cropRepository, 'findOne').mockResolvedValue(null);

      const result = await cropRepository.findCropByUuid('uuid');

      expect(cropRepository.findOne).toHaveBeenCalled();
      expect(cropRepository.findOne).toHaveBeenCalledTimes(1);
      expect(cropRepository.findOne).toHaveBeenCalledWith({
        uuid: 'uuid',
      });
      expect(result.isEmpty()).toBeTruthy();
      expect(result.isPresent()).toBeFalsy();
      expect(result.get()).toBeNull();
    });
  });
});
