import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListAllProducersUseCase } from '../use-case/implementation/ListAllProducersUseCase';
import { Producer } from '../entity/Producer';
import { ApplicationError } from '@shared/types/ApplicationError';

@ApiTags('producer')
@Controller('producer')
export class ProducerController {
  constructor(
    private readonly listAllProducersUseCase: ListAllProducersUseCase,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'This route return all producer registered on database.',
  })
  @ApiOkResponse({
    description: 'Returnig list of producer empty or full.',
    type: Producer,
    isArray: true,
  })
  async listAllProducers(): Promise<Producer[] | ApplicationError> {
    const result = await this.listAllProducersUseCase.execute();

    if (result.isLeft()) {
      return result.getValue();
    }

    return result.getValue();
  }
}
