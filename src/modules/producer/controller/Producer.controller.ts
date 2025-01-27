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
  ApiBadRequestResponse,
  ApiNotFoundResponse,
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
import { CreateProducerError } from '../error/CreateProducerError';
import {
  CropErrorMessages,
  HarvestErrorMessages,
  ProducerErrorMessages,
  RuralPropertieErrorMessages,
} from '@shared/messages/error';
import { ValidateAreasError } from '@modules/rural_propertie/error/ValidateAreasError';
import { HarvestNotExistsError } from '@modules/harvest/error/HarvestNotExistsError';
import { SomeCropNotExistsError } from '@modules/crop/error/SomeCropNotExistsError';
import { CreateRuralPropertieError } from '@modules/rural_propertie/error/CreateRuralPropertieError';
import { CreateCropsPlantedError } from '@modules/crop/error/CreateCropsPlantedError';
import { ProducerNotExistsError } from '../error/ProducerNotExistsError';
import { CpfOrCnpjExistsError } from '../error/CpfOrCnpjExistsError';
import { RuralPropertieNotExistsError } from '@modules/rural_propertie/error/RuralPropertieNotExistsError';

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
  @ApiBadRequestResponse({
    description: ProducerErrorMessages.FAILURE_CRATE_PRODUCER,
    type: CreateProducerError,
  })
  @ApiBadRequestResponse({
    description: RuralPropertieErrorMessages.ERROR_VALIDATE_AREAS,
    type: ValidateAreasError,
  })
  @ApiBadRequestResponse({
    description: RuralPropertieErrorMessages.FAILURE_CRATE_PURAL_PROPERTIE,
    type: CreateRuralPropertieError,
  })
  @ApiBadRequestResponse({
    description: CropErrorMessages.FAILURE_CRATE_CROPS_PLANTED,
    type: CreateCropsPlantedError,
  })
  @ApiNotFoundResponse({
    description: HarvestErrorMessages.HARVEST_NOT_EXISTS,
    type: HarvestNotExistsError,
  })
  @ApiNotFoundResponse({
    description: CropErrorMessages.SOME_CROP_NOT_EXISTS,
    type: SomeCropNotExistsError,
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
  @ApiNotFoundResponse({
    description: ProducerErrorMessages.PRODUCER_NOT_EXISTS,
    type: ProducerNotExistsError,
  })
  @ApiNotFoundResponse({
    description: RuralPropertieErrorMessages.RURAL_PROPERTIE_NOT_EXISTS,
    type: RuralPropertieNotExistsError,
  })
  @ApiNotFoundResponse({
    description: HarvestErrorMessages.HARVEST_NOT_EXISTS,
    type: HarvestNotExistsError,
  })
  @ApiNotFoundResponse({
    description: CropErrorMessages.SOME_CROP_NOT_EXISTS,
    type: SomeCropNotExistsError,
  })
  @ApiBadRequestResponse({
    description: ProducerErrorMessages.CPF_CNPJ_EXISTS,
    type: CpfOrCnpjExistsError,
  })
  @ApiBadRequestResponse({
    description: RuralPropertieErrorMessages.ERROR_VALIDATE_AREAS,
    type: ValidateAreasError,
  })
  @ApiBadRequestResponse({
    description: CropErrorMessages.FAILURE_CRATE_CROPS_PLANTED,
    type: CreateCropsPlantedError,
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
  @ApiNotFoundResponse({
    description: ProducerErrorMessages.PRODUCER_NOT_EXISTS,
    type: ProducerNotExistsError,
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
