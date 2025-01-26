/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HarvestController } from './Harvest.controller';
import { ListAllHarvestUseCase } from '../use-case/implementation/ListAllHarvestUseCase';
import { buildSuccess } from '@shared/utils/buildSuccess';

describe('[E2E] HarvestController', () => {
  let app: INestApplication;
  let listAllHarvestUseCase: jest.Mocked<ListAllHarvestUseCase>;

  const mockHarvests = [
    {
      id: 1,
      name: 'Harvest 1',
    },
    {
      id: 2,
      name: 'Harvest 2',
    },
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [HarvestController],
      providers: [
        {
          provide: ListAllHarvestUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue(buildSuccess(mockHarvests)),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    listAllHarvestUseCase = moduleFixture.get(ListAllHarvestUseCase);
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of harvests successfully', async () => {
    const response = await request(app.getHttpServer())
      .get('/harvest')
      .expect(200);

    expect(listAllHarvestUseCase.execute).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockHarvests);
  });

  it('should return an empty list if no harvests are found', async () => {
    listAllHarvestUseCase.execute.mockResolvedValueOnce(buildSuccess([]));

    const response = await request(app.getHttpServer())
      .get('/harvest')
      .expect(200);

    expect(listAllHarvestUseCase.execute).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual([]);
  });
});
