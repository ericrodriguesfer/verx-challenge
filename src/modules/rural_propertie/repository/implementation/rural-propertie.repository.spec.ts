/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';

import { RuralPropertieRepository } from './RuralPropertieRepository';
import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';

describe('[REPOSITORY] RuralPropertie', () => {
  let ruralPropertieRepository: RuralPropertieRepository;
  let entityManagerMock: jest.Mocked<EntityManager>;

  const mockRuralPropertie = {
    id: 1,
    uuid: 'uuid',
    name: 'name',
    producer: { id: 1, name: 'name' } as any,
    totalAreaFarm: 100,
    arableArea: 70,
    vegetationArea: 30,
    state: 'SP',
  };

  const mockTotalValues = {
    totalRuralProperties: 10,
    totalHectares: 1000.5,
  };

  const mockPieChartData = [
    {
      state: 'SP',
      crop: 'crop',
      totalArableArea: 500,
      totalVegetationArea: 200,
    },
    {
      state: 'MG',
      crop: 'crop',
      totalArableArea: 300,
      totalVegetationArea: 100,
    },
  ];

  beforeEach(async () => {
    entityManagerMock = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<EntityManager>;

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: RuralPropertieRepository,
          useFactory: () => {
            const repo = new RuralPropertieRepository(
              entityManagerMock,
              RuralPropertie,
            );
            jest
              .spyOn(repo, 'getEntityManager')
              .mockReturnValue(entityManagerMock);
            return repo;
          },
        },
      ],
    }).compile();

    ruralPropertieRepository = module.get(RuralPropertieRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined repository', () => {
    expect(ruralPropertieRepository).toBeDefined();
  });

  describe('findByProducerId', () => {
    it('should return rural properties by producer ID', async () => {
      jest
        .spyOn(ruralPropertieRepository, 'find')
        .mockResolvedValue([mockRuralPropertie]);

      const result = await ruralPropertieRepository.findByProducerId(1);

      expect(ruralPropertieRepository.find).toHaveBeenCalled();
      expect(ruralPropertieRepository.find).toHaveBeenCalledTimes(1);
      expect(ruralPropertieRepository.find).toHaveBeenCalledWith({
        producer: { id: 1 },
      });
      expect(result.isEmpty()).toBeFalsy();
      expect(result.isPresent()).toBeTruthy();
      expect(result.get()).toEqual([mockRuralPropertie]);
    });

    it('should return an empty Optional when no rural properties are found', async () => {
      jest.spyOn(ruralPropertieRepository, 'find').mockResolvedValue([]);

      const result = await ruralPropertieRepository.findByProducerId(2);

      expect(ruralPropertieRepository.find).toHaveBeenCalled();
      expect(ruralPropertieRepository.find).toHaveBeenCalledTimes(1);
      expect(ruralPropertieRepository.find).toHaveBeenCalledWith({
        producer: { id: 2 },
      });
      expect(result.isEmpty()).toBeTruthy();
      expect(result.isPresent()).toBeFalsy();
      expect(result.get()).toBeNull();
    });
  });

  describe('findByUuid', () => {
    it('should return rural properties by UUID', async () => {
      jest
        .spyOn(ruralPropertieRepository, 'findOne')
        .mockResolvedValue([mockRuralPropertie]);

      const result = await ruralPropertieRepository.findByUuid('uuid');

      expect(ruralPropertieRepository.findOne).toHaveBeenCalled();
      expect(ruralPropertieRepository.findOne).toHaveBeenCalledTimes(1);
      expect(ruralPropertieRepository.findOne).toHaveBeenCalledWith({
        uuid: 'uuid',
      });
      expect(result.isEmpty()).toBeFalsy();
      expect(result.isPresent()).toBeTruthy();
      expect(result.get()).toEqual([mockRuralPropertie]);
    });

    it('should return an empty Optional when no rural propertie are found', async () => {
      jest.spyOn(ruralPropertieRepository, 'findOne').mockResolvedValue([]);

      const result = await ruralPropertieRepository.findByUuid('uuid');

      expect(ruralPropertieRepository.findOne).toHaveBeenCalled();
      expect(ruralPropertieRepository.findOne).toHaveBeenCalledTimes(1);
      expect(ruralPropertieRepository.findOne).toHaveBeenCalledWith({
        uuid: 'uuid',
      });
      expect(result.isEmpty()).toBeTruthy();
      expect(result.isPresent()).toBeFalsy();
      expect(result.get()).toBeNull();
    });
  });

  describe('getTotalRuralPropertiesAndHectares', () => {
    it('should return the total rural properties and hectares', async () => {
      entityManagerMock.execute.mockResolvedValue([mockTotalValues]);

      const result =
        await ruralPropertieRepository.getTotalRuralPropertiesAndHectares();

      expect(entityManagerMock.execute).toHaveBeenCalled();
      expect(entityManagerMock.execute).toHaveBeenCalledTimes(1);
      expect(entityManagerMock.execute).toHaveBeenCalledWith(
        `SELECT
        COUNT(rp.uuid)::INTEGER AS totalRuralProperties,
        SUM(rp.total_area_farm)::FLOAT AS totalHectares
      FROM rural_propertie AS rp;`,
      );
      expect(result.isEmpty()).toBeFalsy();
      expect(result.isPresent()).toBeTruthy();
      expect(result.get()).toEqual(mockTotalValues);
    });

    it('should return an empty Optional when no data is available', async () => {
      entityManagerMock.execute.mockResolvedValue([]);

      const result =
        await ruralPropertieRepository.getTotalRuralPropertiesAndHectares();

      expect(entityManagerMock.execute).toHaveBeenCalled();
      expect(entityManagerMock.execute).toHaveBeenCalledTimes(1);
      expect(result.isPresent()).toBeFalsy();
      expect(result.isEmpty()).toBeTruthy();
      expect(result.get()).toBeNull();
    });
  });

  describe('getPieChartData', () => {
    it('should return pie chart data', async () => {
      entityManagerMock.execute.mockResolvedValue(mockPieChartData);

      const result = await ruralPropertieRepository.getPieChartData();

      expect(entityManagerMock.execute).toHaveBeenCalled();
      expect(entityManagerMock.execute).toHaveBeenCalledTimes(1);
      expect(entityManagerMock.execute).toHaveBeenCalledWith(`
      SELECT
        rp.state AS state,
        c.name AS crop,
        SUM(rp.arable_area)::FLOAT AS totalArableArea,
        SUM(rp.vegetation_area)::FLOAT AS totalVegetationArea
      FROM
        rural_propertie rp
      LEFT JOIN
        crops_planted cp ON rp.id = cp.rural_propertie_id
      LEFT JOIN
        crop c ON cp.crop_id = c.id
      GROUP BY
        rp.state, c.name
      ORDER BY
        rp.state ASC, c.name ASC;`);
      expect(result.isEmpty()).toBeFalsy();
      expect(result.isPresent()).toBeTruthy();
      expect(result.get()).toEqual(mockPieChartData);
    });

    it('should return an empty Optional when no data is available', async () => {
      entityManagerMock.execute.mockResolvedValue([]);

      const result = await ruralPropertieRepository.getPieChartData();

      expect(entityManagerMock.execute).toHaveBeenCalled();
      expect(entityManagerMock.execute).toHaveBeenCalledTimes(1);
      expect(entityManagerMock.execute).toHaveBeenCalled();
      expect(result.isEmpty()).toBeTruthy();
      expect(result.isPresent()).toBeFalsy();
      expect(result.get()).toBeNull();
    });
  });
});
