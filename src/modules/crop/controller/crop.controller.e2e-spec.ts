/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { CropController } from './Crop.controller';
import { ListAllCropsUseCase } from '../use-case/implementation/ListAllCropsUseCase';
import { buildSuccess } from '@shared/utils/buildSuccess';

describe('[E2E] CropController', () => {
  let app: INestApplication;
  let listAllCropsUseCase: jest.Mocked<ListAllCropsUseCase>;

  const mockCrops = [
    {
      id: 1,
      name: 'Crop 1',
    },
    {
      id: 2,
      name: 'Crop 2',
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CropController],
      providers: [
        {
          provide: ListAllCropsUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(buildSuccess(mockCrops)),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    listAllCropsUseCase = moduleFixture.get(ListAllCropsUseCase);
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of crops successfully', async () => {
    const response = await request(app.getHttpServer())
      .get('/crop')
      .expect(200);

    expect(listAllCropsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockCrops);
  });

  it('should return an empty list if no crops are found', async () => {
    listAllCropsUseCase.execute.mockResolvedValueOnce(buildSuccess([]));

    const response = await request(app.getHttpServer())
      .get('/crop')
      .expect(200);

    expect(listAllCropsUseCase.execute).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual([]);
  });
});
