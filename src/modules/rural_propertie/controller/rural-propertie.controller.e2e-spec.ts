/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { RuralPropertieController } from './RuralPropertie.controller';
import { GetDataDashboardUseCase } from '../use-case/implementation/GetDataDashboardUseCase';
import { buildSuccess } from '@shared/utils/buildSuccess';

describe('[E2E] RuralPropertieController', () => {
  let app: INestApplication;
  let getDataDashboardUseCase: jest.Mocked<GetDataDashboardUseCase>;

  const mockDashboardData = {
    values: { totalRuralProperties: 5, totalHectares: 1000 },
    pieData: [
      { category: 'Crops', value: 500 },
      { category: 'Forests', value: 300 },
      { category: 'Other', value: 200 },
    ],
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RuralPropertieController],
      providers: [
        {
          provide: GetDataDashboardUseCase,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue(buildSuccess(mockDashboardData)),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    getDataDashboardUseCase = moduleFixture.get(GetDataDashboardUseCase);
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return dashboard data successfully', async () => {
    const response = await request(app.getHttpServer())
      .get('/rural-propertie/dashboard')
      .expect(200);

    expect(getDataDashboardUseCase.execute).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockDashboardData);
  });
});
