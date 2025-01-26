/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { GetDataDashboardUseCase } from './GetDataDashboardUseCase';
import { RuralPropertieRepository } from '@modules/rural_propertie/repository/implementation/RuralPropertieRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';
import { Optional } from '@shared/types/Optional';
import {
  PieChartData,
  TotalRuralPropertiesAndHectares,
} from '@modules/rural_propertie/repository/IRuralPropertieRepository';

describe('[USE-CASE] GetDataDashboard', () => {
  let getDataDashboardUseCase: GetDataDashboardUseCase;
  let ruralPropertieRepository: jest.Mocked<RuralPropertieRepository>;

  const mockTotalValues = {
    totalRuralProperties: 5,
    totalHectares: 1000,
  };

  const mockPieChartData = [
    {
      state: 'state 2',
      crop: 'crio 1',
      totalarablearea: 300,
      totalvegetationarea: 150,
    },
    {
      state: 'state 1',
      crop: 'crio 1',
      totalarablearea: 500,
      totalvegetationarea: 50,
    },
    {
      state: 'state 3',
      crop: 'crio 2',
      totalarablearea: 200,
      totalvegetationarea: 20,
    },
  ];

  const mockDashboardData = {
    values: mockTotalValues,
    pieData: mockPieChartData,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDataDashboardUseCase,
        {
          provide: RuralPropertieRepository,
          useValue: {
            getTotalRuralPropertiesAndHectares: jest
              .fn()
              .mockResolvedValue(Optional.create(mockTotalValues)),
            getPieChartData: jest
              .fn()
              .mockResolvedValue(Optional.create(mockPieChartData)),
          },
        },
      ],
    }).compile();

    getDataDashboardUseCase = module.get<GetDataDashboardUseCase>(
      GetDataDashboardUseCase,
    );
    ruralPropertieRepository = module.get(RuralPropertieRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined use case', () => {
    expect(getDataDashboardUseCase).toBeDefined();
  });

  it('should return dashboard data with total values and pie chart data', async () => {
    const result = await getDataDashboardUseCase.execute();

    expect(
      ruralPropertieRepository.getTotalRuralPropertiesAndHectares,
    ).toHaveBeenCalled();
    expect(
      ruralPropertieRepository.getTotalRuralPropertiesAndHectares,
    ).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.getPieChartData).toHaveBeenCalled();
    expect(ruralPropertieRepository.getPieChartData).toHaveBeenCalledTimes(1);

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result).toEqual(buildSuccess(mockDashboardData));
  });

  it('should return empty data if no values are found', async () => {
    ruralPropertieRepository.getTotalRuralPropertiesAndHectares.mockResolvedValueOnce(
      Optional.create<TotalRuralPropertiesAndHectares>({
        totalRuralProperties: 0,
        totalHectares: 0,
      }),
    );
    ruralPropertieRepository.getPieChartData.mockResolvedValueOnce(
      Optional.create<PieChartData[]>([]),
    );

    const result = await getDataDashboardUseCase.execute();

    expect(
      ruralPropertieRepository.getTotalRuralPropertiesAndHectares,
    ).toHaveBeenCalled();
    expect(
      ruralPropertieRepository.getTotalRuralPropertiesAndHectares,
    ).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.getPieChartData).toHaveBeenCalled();
    expect(ruralPropertieRepository.getPieChartData).toHaveBeenCalledTimes(1);

    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result).toEqual(
      buildSuccess({
        values: { totalRuralProperties: 0, totalHectares: 0 },
        pieData: null,
      }),
    );
  });
});
