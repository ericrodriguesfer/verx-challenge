import {
  IUpdateProducerInput,
  IUpdateProducerOutput,
  IUpdateProducerUseCase,
} from '../IUpdateProducerUseCase';
import { Inject, Injectable } from '@nestjs/common';
import { ProducerRepository } from '@modules/producer/repository/implementation/ProducerRepository';
import { CropsPlantedRepository } from '@modules/crop/repository/implementation/CropsPlantedRepository';
import { HarvestRepository } from '@modules/harvest/repository/implementation/HarvestRepository';
import { RuralPropertieRepository } from '@modules/rural_propertie/repository/implementation/RuralPropertieRepository';
import { buildError } from '@shared/utils/buildError';
import { ProducerNotExistsError } from '@modules/producer/error/ProducerNotExistsError';
import { CpfOrCnpjExistsError } from '@modules/producer/error/CpfOrCnpjExistsError';
import { RuralPropertieNotExistsError } from '@modules/rural_propertie/error/RuralPropertieNotExistsError';
import { IGetCropsProvider } from '@modules/crop/provider/get-crops/IGetCropsProvider';
import { GetCropsProvider } from '@modules/crop/provider/get-crops/implementation/GetCropsProviders';
import { ValidateCropsProvider } from '@modules/crop/provider/get-crops/implementation/ValidateCropsProvider';
import { IValidateCropsProvider } from '@modules/crop/provider/get-crops/IValidateCropsProvider';
import { ValidateAreasProvider } from '@modules/rural_propertie/provider/validate-areas/implementation/ValidateAreasProvider';
import { IValidateAreasProvider } from '@modules/rural_propertie/provider/validate-areas/IValidateAreasProvider';
import { ValidateAreasError } from '@modules/rural_propertie/error/ValidateAreasError';
import { HarvestNotExistsError } from '@modules/harvest/error/HarvestNotExistsError';
import { SomeCropNotExistsError } from '@modules/crop/error/SomeCropNotExistsError';
import { CreateCropsPlantedError } from '@modules/crop/error/CreateCropsPlantedError';
import { buildSuccess } from '@shared/utils/buildSuccess';
import { Optional } from '@shared/types/Optional';
import { CropsPlanted } from '@modules/crop/entity/CropsPlanted';

@Injectable()
export class UpdateProducerUseCase implements IUpdateProducerUseCase {
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
    producerUuid,
    ruralPropertieUuid,
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
  }: IUpdateProducerInput): Promise<IUpdateProducerOutput> {
    const producer = await this.producerRepository.findByUuid(producerUuid);

    if (producer.isEmpty()) {
      return buildError(new ProducerNotExistsError());
    }

    if (name) {
      producer.get().name = name;
    }

    if (cpfOrCnpj) {
      const producerWithCpfCnpj =
        await this.producerRepository.findByCpfOrCnpj(cpfOrCnpj);

      if (producerWithCpfCnpj.isPresent()) {
        return buildError(new CpfOrCnpjExistsError());
      }
      producer.get().cprOrCnpj = cpfOrCnpj;
    }

    await this.producerRepository.getEntityManager().flush();

    if (ruralPropertieUuid) {
      const ruralPropertie =
        await this.ruralPropertieRepository.findByUuid(ruralPropertieUuid);

      if (ruralPropertie.isEmpty()) {
        return buildError(new RuralPropertieNotExistsError());
      }

      if (ruralPropertieName) {
        ruralPropertie.get().name = ruralPropertieName;
      }

      if (city) {
        ruralPropertie.get().city = city;
      }

      if (state) {
        ruralPropertie.get().state = state;
      }

      if (arableArea && totalAreaFarm && vegetationArea) {
        if (
          this.validateAreasProvider.validateAreas(
            totalAreaFarm,
            arableArea,
            vegetationArea,
          )
        ) {
          return buildError(new ValidateAreasError());
        }

        ruralPropertie.get().arableArea = arableArea;
        ruralPropertie.get().vegetationArea = vegetationArea;
        ruralPropertie.get().totalAreaFarm = totalAreaFarm;
      }

      if (harvestUuid) {
        const harvest = await this.harvestRepository.findByUuid(harvestUuid);

        if (harvest.isEmpty()) {
          return buildError(new HarvestNotExistsError());
        }

        ruralPropertie.get().harvest = harvest.get();
      }

      await this.ruralPropertieRepository.getEntityManager().flush();

      if (crops) {
        const cropsSearching = await this.getCropsProvider.getCrops(crops);

        if (this.validateCropsProvider.validateCrops(crops, cropsSearching)) {
          return buildError(new SomeCropNotExistsError());
        }

        await this.cropsPlantedRepository.deleteCropsPlantedByRuralPropertieUuid(
          ruralPropertie.get().uuid,
        );

        const cropsCreated = Optional.create<CropsPlanted[]>(
          await Promise.all(
            cropsSearching.map(async (crop) => {
              const cropToInsert = this.cropsPlantedRepository.create({
                crop,
                ruralPropertie: ruralPropertie.get(),
              });
              await this.cropsPlantedRepository.insert(cropToInsert);

              return cropToInsert;
            }),
          ),
        );

        if (
          cropsCreated.isEmpty() ||
          cropsCreated.get().length !== crops.length
        ) {
          return buildError(new CreateCropsPlantedError());
        }
      }

      await this.cropsPlantedRepository.getEntityManager().flush();
    }

    return buildSuccess(producer.get());
  }
}
