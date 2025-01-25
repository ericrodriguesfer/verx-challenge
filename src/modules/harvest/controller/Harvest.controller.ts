import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Harvest } from '../entity/Harvest';
import { ApplicationError } from '@shared/types/ApplicationError';
import { ListAllHarvestUseCase } from '../use-case/implementation/ListAllHarvestUseCase';

@ApiTags('harvest')
@Controller('harvest')
export class HarvestController {
  constructor(private readonly listAllHarvestUseCase: ListAllHarvestUseCase) {}

  @Get('')
  @ApiOperation({
    summary: 'This route return all harvest registered on database.',
  })
  @ApiOkResponse({
    description: 'Returnig list of harvest empty or full.',
    type: Harvest,
    isArray: true,
  })
  async listAllHarvest(): Promise<Harvest[] | ApplicationError> {
    const result = await this.listAllHarvestUseCase.execute();

    if (result.isLeft()) {
      return result.getValue();
    }

    return result.getValue();
  }
}
