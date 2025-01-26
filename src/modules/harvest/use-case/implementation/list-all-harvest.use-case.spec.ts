/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ListAllHarvestUseCase } from './ListAllHarvestUseCase';
import { HarvestRepository } from '@modules/harvest/repository/implementation/HarvestRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';

describe('[USE-CASE] ListAllHarvest', () => {
  let listAllHarvestUseCase: ListAllHarvestUseCase;
  let harvestRepository: jest.Mocked<HarvestRepository>;

  const mockHarvest = {
    id: 1,
    name: 'name',
  };

  const mockHarvests = [mockHarvest];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAllHarvestUseCase,
        {
          provide: HarvestRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockHarvests),
          },
        },
      ],
    }).compile();

    listAllHarvestUseCase = module.get<ListAllHarvestUseCase>(
      ListAllHarvestUseCase,
    );
    harvestRepository = module.get(HarvestRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined use case', () => {
    expect(listAllHarvestUseCase).toBeDefined();
  });

  it('should return a list of harvests', async () => {
    const result = await listAllHarvestUseCase.execute();

    expect(harvestRepository.findAll).toHaveBeenCalled();
    expect(harvestRepository.findAll).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findAll).toHaveBeenCalledWith();
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).toHaveLength(mockHarvests.length);
    expect(result).toEqual(buildSuccess(mockHarvests));
  });

  it('should return an empty list if no harvests are found', async () => {
    harvestRepository.findAll.mockResolvedValueOnce([]);
    const result = await listAllHarvestUseCase.execute();

    expect(harvestRepository.findAll).toHaveBeenCalled();
    expect(harvestRepository.findAll).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findAll).toHaveBeenCalledWith();
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).toHaveLength(0);
    expect(result).toEqual(buildSuccess([]));
  });
});
