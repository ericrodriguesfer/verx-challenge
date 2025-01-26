/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Collection } from '@mikro-orm/core';

import { CreateProducerUseCase } from './CreateProducerUseCase';
import { ProducerRepository } from '@modules/producer/repository/implementation/ProducerRepository';
import { RuralPropertieRepository } from '@modules/rural_propertie/repository/implementation/RuralPropertieRepository';
import { HarvestRepository } from '@modules/harvest/repository/implementation/HarvestRepository';
import { CropsPlantedRepository } from '@modules/crop/repository/implementation/CropsPlantedRepository';
import { GetCropsProvider } from '@modules/crop/provider/get-crops/implementation/GetCropsProviders';
import { ValidateCropsProvider } from '@modules/crop/provider/get-crops/implementation/ValidateCropsProvider';
import { ValidateAreasProvider } from '@modules/rural_propertie/provider/validate-areas/implementation/ValidateAreasProvider';
import { Producer } from '@modules/producer/entity/Producer';
import { buildSuccess } from '@shared/utils/buildSuccess';
import { buildError } from '@shared/utils/buildError';
import { CreateProducerError } from '@modules/producer/error/CreateProducerError';
import { HarvestNotExistsError } from '@modules/harvest/error/HarvestNotExistsError';
import { SomeCropNotExistsError } from '@modules/crop/error/SomeCropNotExistsError';
import { ValidateAreasError } from '@modules/rural_propertie/error/ValidateAreasError';
import { Crop } from '@modules/crop/entity/Crop';
import { Harvest } from '@modules/harvest/entity/Harvest';
import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';
import { Optional } from '@shared/types/Optional';
import { CreateRuralPropertieError } from '@modules/rural_propertie/error/CreateRuralPropertieError';
import { CreateCropsPlantedError } from '@modules/crop/error/CreateCropsPlantedError';
import { ApplicationError } from '@shared/types/ApplicationError';

describe('[USE-CASE] CreateProducer', () => {
  let createProducerUseCase: CreateProducerUseCase;
  let producerRepository: jest.Mocked<ProducerRepository>;
  let ruralPropertieRepository: jest.Mocked<RuralPropertieRepository>;
  let harvestRepository: jest.Mocked<HarvestRepository>;
  let cropsPlantedRepository: jest.Mocked<CropsPlantedRepository>;
  let getCropsProvider: jest.Mocked<GetCropsProvider>;
  let validateCropsProvider: jest.Mocked<ValidateCropsProvider>;
  let validateAreasProvider: jest.Mocked<ValidateAreasProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProducerUseCase,
        {
          provide: ProducerRepository,
          useValue: {
            findByCpfOrCnpj: jest.fn(),
            create: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: RuralPropertieRepository,
          useValue: {
            create: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: HarvestRepository,
          useValue: {
            findByUuid: jest.fn(),
          },
        },
        {
          provide: CropsPlantedRepository,
          useValue: {
            create: jest.fn(),
            insert: jest.fn(),
          },
        },
        {
          provide: GetCropsProvider,
          useValue: {
            getCrops: jest.fn(),
          },
        },
        {
          provide: ValidateCropsProvider,
          useValue: {
            validateCrops: jest.fn(),
          },
        },
        {
          provide: ValidateAreasProvider,
          useValue: {
            validateAreas: jest.fn(),
          },
        },
      ],
    }).compile();

    createProducerUseCase = module.get<CreateProducerUseCase>(
      CreateProducerUseCase,
    );
    producerRepository = module.get(ProducerRepository);
    ruralPropertieRepository = module.get(RuralPropertieRepository);
    harvestRepository = module.get(HarvestRepository);
    cropsPlantedRepository = module.get(CropsPlantedRepository);
    getCropsProvider = module.get(GetCropsProvider);
    validateCropsProvider = module.get(ValidateCropsProvider);
    validateAreasProvider = module.get(ValidateAreasProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined use case', () => {
    expect(createProducerUseCase).toBeDefined();
  });

  const mockProducer = new Producer();
  const mockCreateProducer = {
    name: 'name',
    cpfOrCnpj: '123456789',
    ruralPropertieName: 'rual 1',
    city: 'city',
    state: 'state',
    totalAreaFarm: 100,
    arableArea: 80,
    vegetationArea: 20,
    harvestUuid: 'uuid',
    crops: ['uuid', 'uuid'],
  };
  const mockHarvest = {
    id: 1,
    uuid: 'uuid',
    name: 'name',
    createdAt: new Date(),
    updatedAt: new Date(),
    ruralProperties: [] as unknown as Collection<RuralPropertie>,
  };

  it('should return an error if producer creation failure', async () => {
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(null!),
    );
    producerRepository.create.mockReturnValueOnce(null!);

    const result = await createProducerUseCase.execute(mockCreateProducer);

    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.create).toHaveBeenCalled();
    expect(producerRepository.create).toHaveBeenCalledTimes(1);
    expect(producerRepository.insert).toHaveBeenCalled();
    expect(producerRepository.insert).toHaveBeenCalledTimes(1);
    expect(validateAreasProvider.validateAreas).not.toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(0);
    expect(harvestRepository.findByUuid).not.toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(0);
    expect(getCropsProvider.getCrops).not.toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(0);
    expect(validateCropsProvider.validateCrops).not.toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(0);
    expect(ruralPropertieRepository.create).not.toHaveBeenCalled();
    expect(ruralPropertieRepository.create).toHaveBeenCalledTimes(0);
    expect(ruralPropertieRepository.insert).not.toHaveBeenCalled();
    expect(ruralPropertieRepository.insert).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.create).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.create).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.insert).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.insert).toHaveBeenCalledTimes(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new CreateProducerError()));
  });

  it('should create a new producer and your rural propertie and return success', async () => {
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(null!),
    );
    producerRepository.create.mockReturnValue(mockProducer);
    producerRepository.insert.mockResolvedValueOnce(Promise.resolve(''));
    validateAreasProvider.validateAreas.mockReturnValue(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(mockHarvest),
    );
    getCropsProvider.getCrops.mockResolvedValueOnce([{}, {}] as Array<Crop>);
    validateCropsProvider.validateCrops.mockReturnValue(false);
    ruralPropertieRepository.create.mockReturnValue({} as any);
    ruralPropertieRepository.insert.mockResolvedValueOnce({} as any);
    cropsPlantedRepository.create.mockReturnValue({} as any);
    cropsPlantedRepository.insert.mockResolvedValueOnce({} as any);

    const result = await createProducerUseCase.execute(mockCreateProducer);

    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.create).toHaveBeenCalled();
    expect(producerRepository.create).toHaveBeenCalledTimes(1);
    expect(producerRepository.insert).toHaveBeenCalled();
    expect(producerRepository.insert).toHaveBeenCalledTimes(1);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(1);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.create).toHaveBeenCalled();
    expect(ruralPropertieRepository.create).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.insert).toHaveBeenCalled();
    expect(ruralPropertieRepository.insert).toHaveBeenCalledTimes(1);
    expect(cropsPlantedRepository.create).toHaveBeenCalled();
    expect(cropsPlantedRepository.create).toHaveBeenCalledTimes(2);
    expect(cropsPlantedRepository.insert).toHaveBeenCalled();
    expect(cropsPlantedRepository.insert).toHaveBeenCalledTimes(2);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).not.toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildSuccess(mockProducer));
  });

  it('should create a new rural propertie for exists producer and return success', async () => {
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(mockProducer),
    );
    validateAreasProvider.validateAreas.mockReturnValue(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(mockHarvest),
    );
    getCropsProvider.getCrops.mockResolvedValueOnce([{}, {}] as Array<Crop>);
    validateCropsProvider.validateCrops.mockReturnValue(false);
    ruralPropertieRepository.create.mockReturnValue({} as any);
    ruralPropertieRepository.insert.mockResolvedValueOnce({} as any);
    cropsPlantedRepository.create.mockReturnValue({} as any);
    cropsPlantedRepository.insert.mockResolvedValueOnce({} as any);

    const result = await createProducerUseCase.execute(mockCreateProducer);

    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.create).not.toHaveBeenCalled();
    expect(producerRepository.create).toHaveBeenCalledTimes(0);
    expect(producerRepository.insert).not.toHaveBeenCalled();
    expect(producerRepository.insert).toHaveBeenCalledTimes(0);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(1);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.create).toHaveBeenCalled();
    expect(ruralPropertieRepository.create).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.insert).toHaveBeenCalled();
    expect(ruralPropertieRepository.insert).toHaveBeenCalledTimes(1);
    expect(cropsPlantedRepository.create).toHaveBeenCalled();
    expect(cropsPlantedRepository.create).toHaveBeenCalledTimes(2);
    expect(cropsPlantedRepository.insert).toHaveBeenCalled();
    expect(cropsPlantedRepository.insert).toHaveBeenCalledTimes(2);
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).not.toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildSuccess(mockProducer));
  });

  it('should return an error a new rural propertie to create producer', async () => {
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(null!),
    );
    producerRepository.create.mockReturnValueOnce(
      await Promise.resolve({} as Producer),
    );
    validateAreasProvider.validateAreas.mockReturnValue(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(mockHarvest),
    );
    getCropsProvider.getCrops.mockResolvedValueOnce([{}, {}] as Array<Crop>);
    validateCropsProvider.validateCrops.mockReturnValue(false);
    ruralPropertieRepository.create.mockReturnValue(null!);
    ruralPropertieRepository.insert.mockResolvedValueOnce(null!);
    cropsPlantedRepository.create.mockReturnValue({} as any);
    cropsPlantedRepository.insert.mockResolvedValueOnce({} as any);

    const result = await createProducerUseCase.execute(mockCreateProducer);

    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.create).toHaveBeenCalled();
    expect(producerRepository.create).toHaveBeenCalledTimes(1);
    expect(producerRepository.insert).toHaveBeenCalled();
    expect(producerRepository.insert).toHaveBeenCalledTimes(1);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(1);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.create).toHaveBeenCalled();
    expect(ruralPropertieRepository.create).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.insert).toHaveBeenCalled();
    expect(ruralPropertieRepository.insert).toHaveBeenCalledTimes(1);
    expect(cropsPlantedRepository.create).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.create).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.insert).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.insert).toHaveBeenCalledTimes(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new CreateRuralPropertieError()));
  });

  it('should return an error a new rural propertie to exists producer', async () => {
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(mockProducer),
    );
    producerRepository.create.mockReturnValueOnce(
      await Promise.resolve({} as Producer),
    );
    validateAreasProvider.validateAreas.mockReturnValue(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(mockHarvest),
    );
    getCropsProvider.getCrops.mockResolvedValueOnce([{}, {}] as Array<Crop>);
    validateCropsProvider.validateCrops.mockReturnValue(false);
    ruralPropertieRepository.create.mockReturnValue(null!);
    ruralPropertieRepository.insert.mockResolvedValueOnce(null!);
    cropsPlantedRepository.create.mockReturnValue({} as any);
    cropsPlantedRepository.insert.mockResolvedValueOnce({} as any);

    const result = await createProducerUseCase.execute(mockCreateProducer);

    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.create).not.toHaveBeenCalled();
    expect(producerRepository.create).toHaveBeenCalledTimes(0);
    expect(producerRepository.insert).not.toHaveBeenCalled();
    expect(producerRepository.insert).toHaveBeenCalledTimes(0);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(1);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.create).toHaveBeenCalled();
    expect(ruralPropertieRepository.create).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.insert).toHaveBeenCalled();
    expect(ruralPropertieRepository.insert).toHaveBeenCalledTimes(1);
    expect(cropsPlantedRepository.create).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.create).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.insert).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.insert).toHaveBeenCalledTimes(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new CreateRuralPropertieError()));
  });

  it('should return an error if areas are invalid', async () => {
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(mockProducer),
    );
    validateAreasProvider.validateAreas.mockReturnValue(true);

    const result = await createProducerUseCase.execute({
      ...mockCreateProducer,
      vegetationArea: 100,
    });

    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.create).not.toHaveBeenCalled();
    expect(producerRepository.create).toHaveBeenCalledTimes(0);
    expect(producerRepository.insert).not.toHaveBeenCalled();
    expect(producerRepository.insert).toHaveBeenCalledTimes(0);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).not.toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(0);
    expect(getCropsProvider.getCrops).not.toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(0);
    expect(validateCropsProvider.validateCrops).not.toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(0);
    expect(ruralPropertieRepository.create).not.toHaveBeenCalled();
    expect(ruralPropertieRepository.create).toHaveBeenCalledTimes(0);
    expect(ruralPropertieRepository.insert).not.toHaveBeenCalled();
    expect(ruralPropertieRepository.insert).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.create).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.create).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.insert).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.insert).toHaveBeenCalledTimes(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new ValidateAreasError()));
  });

  it('should return an error if harvest does not exist', async () => {
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(mockProducer),
    );
    validateAreasProvider.validateAreas.mockReturnValue(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(null!),
    );

    const result = await createProducerUseCase.execute(mockCreateProducer);

    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.create).not.toHaveBeenCalled();
    expect(producerRepository.create).toHaveBeenCalledTimes(0);
    expect(producerRepository.insert).not.toHaveBeenCalled();
    expect(producerRepository.insert).toHaveBeenCalledTimes(0);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).not.toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(0);
    expect(validateCropsProvider.validateCrops).not.toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(0);
    expect(ruralPropertieRepository.create).not.toHaveBeenCalled();
    expect(ruralPropertieRepository.create).toHaveBeenCalledTimes(0);
    expect(ruralPropertieRepository.insert).not.toHaveBeenCalled();
    expect(ruralPropertieRepository.insert).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.create).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.create).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.insert).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.insert).toHaveBeenCalledTimes(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new HarvestNotExistsError()));
  });

  it('should return an error if crops are invalid', async () => {
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(mockProducer),
    );
    validateAreasProvider.validateAreas.mockReturnValue(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(mockHarvest),
    );
    getCropsProvider.getCrops.mockResolvedValueOnce([]);
    validateCropsProvider.validateCrops.mockReturnValue(true);

    const result = await createProducerUseCase.execute(mockCreateProducer);

    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.create).not.toHaveBeenCalled();
    expect(producerRepository.create).toHaveBeenCalledTimes(0);
    expect(producerRepository.insert).not.toHaveBeenCalled();
    expect(producerRepository.insert).toHaveBeenCalledTimes(0);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(1);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.create).not.toHaveBeenCalled();
    expect(ruralPropertieRepository.create).toHaveBeenCalledTimes(0);
    expect(ruralPropertieRepository.insert).not.toHaveBeenCalled();
    expect(ruralPropertieRepository.insert).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.create).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.create).toHaveBeenCalledTimes(0);
    expect(cropsPlantedRepository.insert).not.toHaveBeenCalled();
    expect(cropsPlantedRepository.insert).toHaveBeenCalledTimes(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new SomeCropNotExistsError()));
  });

  it('should return an error a new crops to rural propertie', async () => {
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(mockProducer),
    );
    validateAreasProvider.validateAreas.mockReturnValue(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(mockHarvest),
    );
    getCropsProvider.getCrops.mockResolvedValueOnce([
      { id: 1 },
      { id: 2 },
    ] as Array<Crop>);
    validateCropsProvider.validateCrops.mockReturnValue(false);
    ruralPropertieRepository.create.mockReturnValue({} as any);
    ruralPropertieRepository.insert.mockResolvedValueOnce({} as any);
    cropsPlantedRepository.create.mockReturnValueOnce(null!);
    cropsPlantedRepository.insert.mockResolvedValueOnce(null!);

    const result = await createProducerUseCase.execute(mockCreateProducer);

    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.create).not.toHaveBeenCalled();
    expect(producerRepository.create).toHaveBeenCalledTimes(0);
    expect(producerRepository.insert).not.toHaveBeenCalled();
    expect(producerRepository.insert).toHaveBeenCalledTimes(0);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(1);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.create).toHaveBeenCalled();
    expect(ruralPropertieRepository.create).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.insert).toHaveBeenCalled();
    expect(ruralPropertieRepository.insert).toHaveBeenCalledTimes(1);
    expect(cropsPlantedRepository.create).toHaveBeenCalled();
    expect(cropsPlantedRepository.create).toHaveBeenCalledTimes(2);
    expect(cropsPlantedRepository.insert).toHaveBeenCalled();
    expect(cropsPlantedRepository.insert).toHaveBeenCalledTimes(2);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new CreateCropsPlantedError()));
  });
});
