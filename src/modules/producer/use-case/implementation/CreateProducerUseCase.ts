import { Inject, Injectable } from '@nestjs/common';

import { CreateProducerDTO } from '@modules/producer/dto/CreateProducerDTO';
import {
  ICreateProducerOutput,
  ICreateProducerUseCase,
} from '../ICreateProducerUseCase';
import { ProducerRepository } from '@modules/producer/repository/implementation/ProducerRepository';
import { HarvestRepository } from '@modules/harvest/repository/implementation/HarvestRepository';
import { RuralPropertieRepository } from '@modules/rural_propertie/repository/implementation/RuralPropertieRepository';
import { CropsPlantedRepository } from '@modules/crop/repository/implementation/CropsPlantedRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';
import { buildError } from '@shared/utils/buildError';
import { CreateProducerError } from '@modules/producer/error/CreateProducerError';
import { HarvestNotExistsError } from '@modules/harvest/error/HarvestNotExistsError';
import { SomeCropNotExistsError } from '@modules/crop/error/SomeCropNotExistsError';
import { CreateCropsPlantedError } from '@modules/crop/error/CreateCropsPlantedError';
import { ValidateAreasError } from '@modules/rural_propertie/error/ValidateAreasError';
import { CreateRuralPropertieError } from '@modules/rural_propertie/error/CreateRuralPropertieError';
import { Producer } from '@modules/producer/entity/Producer';
import { ValidateCropsProvider } from '@modules/crop/provider/validate-crops/implementation/ValidateCropsProvider';
import { IValidateCropsProvider } from '@modules/crop/provider/validate-crops/IValidateCropsProvider';
import { ValidateAreasProvider } from '@modules/rural_propertie/provider/validate-areas/implementation/ValidateAreasProvider';
import { IValidateAreasProvider } from '@modules/rural_propertie/provider/validate-areas/IValidateAreasProvider';
import { GetCropsProvider } from '@modules/crop/provider/get-crops/implementation/GetCropsProviders';
import { IGetCropsProvider } from '@modules/crop/provider/get-crops/IGetCropsProvider';
import { Optional } from '@shared/types/Optional';
import { CropsPlanted } from '@modules/crop/entity/CropsPlanted';

@Injectable()
export class CreateProducerUseCase implements ICreateProducerUseCase {
  constructor(
    private readonly producerRepository: ProducerRepository,
    private readonly ruralPropertieRepository: RuralPropertieRepository,
    private readonly harvestRepository: HarvestRepository,
    private readonly cropsPlantedRepository: CropsPlantedRepository,
    @Inject(GetCropsProvider)
    private readonly getCropsProvider: IGetCropsProvider,
    @Inject(ValidateCropsProvider)
    private readonly validateCropsProvider: IValidateCropsProvider,
    @Inject(ValidateAreasProvider)
    private readonly validateAreasProvider: IValidateAreasProvider,
  ) {}

  async execute({
    name,
    cpfOrCnpj,
    ruralPropertieName,
    city,
    state,
    totalAreaFarm,
    arableArea,
    vegetationArea,
    harvestUuid,
    crops,
  }: CreateProducerDTO): Promise<ICreateProducerOutput> {
    const producer = await this.producerRepository.findByCpfOrCnpj(cpfOrCnpj);

    if (producer.isEmpty()) {
      const producerCreated = this.producerRepository.create({
        name,
        cprOrCnpj: cpfOrCnpj,
      });
      await this.producerRepository.insert(producerCreated);

      if (!producerCreated) {
        return buildError(new CreateProducerError());
      }

      return await this.createRuralPropertieAndCropsPlanted({
        ruralPropertieName,
        city,
        state,
        totalAreaFarm,
        arableArea,
        vegetationArea,
        harvestUuid,
        crops,
        producer: producerCreated,
      });
    }

    return await this.createRuralPropertieAndCropsPlanted({
      ruralPropertieName,
      city,
      state,
      totalAreaFarm,
      arableArea,
      vegetationArea,
      harvestUuid,
      crops,
      producer: producer.get(),
    });
  }

  private async createRuralPropertieAndCropsPlanted({
    ruralPropertieName,
    city,
    state,
    totalAreaFarm,
    arableArea,
    vegetationArea,
    harvestUuid,
    crops,
    producer,
  }: Omit<CreateProducerDTO, 'name' | 'cpfOrCnpj'> & {
    producer: Producer;
  }): Promise<ICreateProducerOutput> {
    if (
      this.validateAreasProvider.validateAreas(
        totalAreaFarm,
        arableArea,
        vegetationArea,
      )
    ) {
      return buildError(new ValidateAreasError());
    }

    const harvest = await this.harvestRepository.findByUuid(harvestUuid);

    if (harvest.isEmpty()) {
      return buildError(new HarvestNotExistsError());
    }

    const cropsSearching = await this.getCropsProvider.getCrops(crops);

    if (this.validateCropsProvider.validateCrops(crops, cropsSearching)) {
      return buildError(new SomeCropNotExistsError());
    }

    const ruralPropertieCreated = this.ruralPropertieRepository.create({
      name: ruralPropertieName,
      city,
      state,
      totalAreaFarm,
      arableArea,
      vegetationArea,
      producer,
      harvest: harvest.get(),
    });
    await this.ruralPropertieRepository.insert(ruralPropertieCreated);

    if (!ruralPropertieCreated) {
      return buildError(new CreateRuralPropertieError());
    }

    const cropsCreated = Optional.create<CropsPlanted[]>(
      await Promise.all(
        cropsSearching.map(async (crop) => {
          const cropToInsert = this.cropsPlantedRepository.create({
            crop,
            ruralPropertie: ruralPropertieCreated,
          });
          await this.cropsPlantedRepository.insert(cropToInsert);

          return cropToInsert;
        }),
      ),
    );

    if (cropsCreated.isEmpty() || cropsCreated.get().length !== crops.length) {
      return buildError(new CreateCropsPlantedError());
    }

    return buildSuccess(producer);
  }
}
