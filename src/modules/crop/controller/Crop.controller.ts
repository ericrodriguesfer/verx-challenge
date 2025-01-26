import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Crop } from '../entity/Crop';
import { ApplicationError } from '@shared/types/ApplicationError';
import { ListAllCropsUseCase } from '../use-case/implementation/ListAllCropsUseCase';
import { CropControllerMessages } from '@shared/messages/flow';

@ApiTags('crop')
@Controller('crop')
export class CropController {
  private readonly logger = new Logger(CropController.name);

  constructor(private readonly listAllCropsUseCase: ListAllCropsUseCase) {}

  @Get('')
  @ApiOperation({
    summary: 'This route return all crops registered on database.',
  })
  @ApiOkResponse({
    description: 'Returnig list of crops empty or full.',
    type: Crop,
    isArray: true,
  })
  async listAllCrops(): Promise<Crop[] | ApplicationError> {
    this.logger.debug(CropControllerMessages.ROUTE_LIST_ALL_CROPS_CALLED);

    const result = await this.listAllCropsUseCase.execute();

    if (result.isLeft()) {
      return result.getValue();
    }

    return result.getValue();
  }
}
