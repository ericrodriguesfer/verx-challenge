import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ListAllProducersUseCase } from '../use-case/implementation/ListAllProducersUseCase';
import { Producer } from '../entity/Producer';
import { ApplicationError } from '@shared/types/ApplicationError';
import { CreateProducerUseCase } from '../use-case/implementation/CreateProducerUseCase';
import { CreateProducerDTO } from '../dto/CreateProducerDTO';
import { DeleteProducerUseCase } from '../use-case/implementation/DeleteProducerUseCase';
import { UpdateProducerDTO } from '../dto/UpdateProducerDTO';
import { UpdateProducerUseCase } from '../use-case/implementation/UpdateProducerUseCase';
import { UUIDQueryParamsPipe } from '@config/decorators/UUIDQueryParamsPipe';
import { ProducerControllerMessages } from '@shared/messages/flow';

@ApiTags('producer')
@Controller('producer')
export class ProducerController {
  private readonly logger = new Logger(ProducerController.name);

  constructor(
    private readonly listAllProducersUseCase: ListAllProducersUseCase,
    private readonly crateProducerUseCase: CreateProducerUseCase,
    private readonly deleteProducerUseCase: DeleteProducerUseCase,
    private readonly updateProducerUseCase: UpdateProducerUseCase,
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
    this.logger.debug(
      ProducerControllerMessages.ROUTE_LIST_ALL_PRODUCERS_CALLED,
    );

    const result = await this.listAllProducersUseCase.execute();

    if (result.isLeft()) {
      return result.getValue();
    }

    return result.getValue();
  }

  @Post('')
  @ApiOperation({
    summary:
      'This route is responsible to create producer and other informations.',
  })
  @ApiOkResponse({
    description: 'Returnig producer created on database.',
    type: Producer,
  })
  async createProducer(
    @Body() createProducer: CreateProducerDTO,
  ): Promise<Producer | ApplicationError> {
    this.logger.debug(ProducerControllerMessages.ROUTE_CREATE_PRODUCER_CALLED);

    const result = await this.crateProducerUseCase.execute({
      ...createProducer,
    });

    if (result.isLeft()) {
      return result.getValue();
    }

    return result.getValue();
  }

  @Put(':producerUuid')
  @ApiOperation({
    summary:
      'This route is responsible to update producer and other informations.',
  })
  @ApiOkResponse({
    description: 'Returnig producer updated on database.',
    type: Producer,
  })
  @ApiQuery({
    name: 'ruralPropertieUuid',
    required: false,
    type: String,
    description: 'Attribute is optional',
  })
  @UsePipes(UUIDQueryParamsPipe)
  async updateProducer(
    @Body() updateProducer: UpdateProducerDTO,
    @Param('producerUuid', new ParseUUIDPipe({ version: '4' }))
    producerUuid: string,
    @Query('ruralPropertieUuid', new ValidationPipe({ transform: true }))
    ruralPropertieUuid?: string,
  ): Promise<Producer | ApplicationError> {
    this.logger.debug(ProducerControllerMessages.ROUTE_UPDATE_PRODUCER_CALLED);

    const result = await this.updateProducerUseCase.execute({
      ...updateProducer,
      producerUuid,
      ruralPropertieUuid,
    });

    if (result.isLeft()) {
      return result.getValue();
    }

    return result.getValue();
  }

  @Delete(':uuid')
  @ApiOperation({
    summary:
      'This route is responsible to delete producer and other informations relates.',
  })
  @ApiOkResponse({
    description: 'Returnig if producer deleted with success.',
    type: Boolean,
  })
  async deleteProducer(
    @Param('uuid', new ParseUUIDPipe({ version: '4' })) uuid: string,
  ): Promise<boolean | ApplicationError> {
    this.logger.debug(ProducerControllerMessages.ROUTE_DELETE_PRODUCER_CALLED);

    const result = await this.deleteProducerUseCase.execute({ uuid });

    if (result.isLeft()) {
      return result.getValue();
    }

    return result.getValue();
  }
}
