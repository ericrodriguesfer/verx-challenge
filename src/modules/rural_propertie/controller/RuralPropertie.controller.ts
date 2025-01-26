import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDataDashboardUseCase } from '../use-case/implementation/GetDataDashboardUseCase';
import { ApplicationError } from '@shared/types/ApplicationError';
import { DashboardDataDTO } from '../dto/DashboardDataDTO';

@ApiTags('rural-propertie')
@Controller('rural-propertie')
export class RuralPropertieController {
  constructor(private readonly getDashboardUseCase: GetDataDashboardUseCase) {}

  @Get('dashboard')
  @ApiOperation({
    summary:
      'This route is responsible to update producer and other informations.',
  })
  @ApiOkResponse({
    description: 'Returnig producer updated on database.',
    type: DashboardDataDTO,
  })
  async getDashboad(): Promise<DashboardDataDTO | ApplicationError> {
    const result = await this.getDashboardUseCase.execute();

    if (result.isLeft()) {
      return result.getValue();
    }

    return result.getValue();
  }
}
