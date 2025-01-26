/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { ListAllCropsUseCase } from './ListAllCropsUseCase';
import { CropRepository } from '@modules/crop/repository/implementation/CropRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';

describe('[USE-CASE] ListAllCrops', () => {
  let listAllCropsUseCase: ListAllCropsUseCase;
  let cropRepository: jest.Mocked<CropRepository>;

  const mockCrop = {
    id: 1,
    name: 'name',
  };

  const mockCrops = [mockCrop];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListAllCropsUseCase,
        {
          provide: CropRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockCrops),
          },
        },
      ],
    }).compile();

    listAllCropsUseCase = module.get<ListAllCropsUseCase>(ListAllCropsUseCase);
    cropRepository = module.get(CropRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined use case', () => {
    expect(listAllCropsUseCase).toBeDefined();
  });

  it('should return a list of crops', async () => {
    const result = await listAllCropsUseCase.execute();

    expect(cropRepository.findAll).toHaveBeenCalled();
    expect(cropRepository.findAll).toHaveBeenCalledTimes(1);
    expect(cropRepository.findAll).toHaveBeenCalledWith();
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).toHaveLength(mockCrops.length);
    expect(result).toEqual(buildSuccess(mockCrops));
  });

  it('should return an empty list if no crops are found', async () => {
    cropRepository.findAll.mockResolvedValueOnce([]);
    const result = await listAllCropsUseCase.execute();

    expect(cropRepository.findAll).toHaveBeenCalled();
    expect(cropRepository.findAll).toHaveBeenCalledTimes(1);
    expect(cropRepository.findAll).toHaveBeenCalledWith();
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).toHaveLength(0);
    expect(result).toEqual(buildSuccess([]));
  });
});
