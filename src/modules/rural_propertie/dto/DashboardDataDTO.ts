import { ApiProperty } from '@nestjs/swagger';

export class DashboardDataDTO {
  @ApiProperty({ type: 'number' })
  totalRuralProperties: number;

  @ApiProperty({ type: 'number' })
  totalHectares: number;

  @ApiProperty({ type: 'string' })
  state: string;

  @ApiProperty({ type: 'string' })
  crop: string;

  @ApiProperty({ type: 'number' })
  totalArableArea: number;

  @ApiProperty({ type: 'number' })
  totalVegetationArea: number;
}
