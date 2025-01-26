import { ApiProperty } from '@nestjs/swagger';

class TotalValuesDashboardDTO {
  @ApiProperty({ type: 'number' })
  totalRuralProperties: number;

  @ApiProperty({ type: 'number' })
  totalHectares: number;
}

class PieDataDashboarDTO {
  @ApiProperty({ type: 'string' })
  state: string;

  @ApiProperty({ type: 'string' })
  crop: string;

  @ApiProperty({ type: 'number' })
  totalArableArea: number;

  @ApiProperty({ type: 'number' })
  totalVegetationArea: number;
}

export class DashboardDataDTO {
  @ApiProperty({ type: () => TotalValuesDashboardDTO })
  values: TotalValuesDashboardDTO;

  @ApiProperty({ type: () => PieDataDashboarDTO })
  pieData: PieDataDashboarDTO[];
}
