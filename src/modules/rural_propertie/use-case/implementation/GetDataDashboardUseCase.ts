import { Injectable } from '@nestjs/common';

import {
  IGetDataDashboardOutput,
  IGetDataDashboardUseCase,
} from '../IGetDataDashboardUseCase';
import { RuralPropertieRepository } from '@modules/rural_propertie/repository/implementation/RuralPropertieRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';

@Injectable()
export class GetDataDashboardUseCase implements IGetDataDashboardUseCase {
  constructor(
    private readonly ruralPropertieRepository: RuralPropertieRepository,
  ) {}

  async execute(): Promise<IGetDataDashboardOutput> {
    const totalValues =
      await this.ruralPropertieRepository.getTotalRuralPropertiesAndHectares();
    const dataPieChart = await this.ruralPropertieRepository.getPieChartData();

    return buildSuccess({
      values: totalValues.get(),
      pieData: dataPieChart.get(),
    });
  }
}
