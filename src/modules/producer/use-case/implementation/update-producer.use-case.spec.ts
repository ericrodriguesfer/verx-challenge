/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { UpdateProducerUseCase } from './UpdateProducerUseCase';
import { ProducerRepository } from '@modules/producer/repository/implementation/ProducerRepository';
import { RuralPropertieRepository } from '@modules/rural_propertie/repository/implementation/RuralPropertieRepository';
import { HarvestRepository } from '@modules/harvest/repository/implementation/HarvestRepository';
import { CropsPlantedRepository } from '@modules/crop/repository/implementation/CropsPlantedRepository';
import { GetCropsProvider } from '@modules/crop/provider/get-crops/implementation/GetCropsProviders';
import { ValidateCropsProvider } from '@modules/crop/provider/get-crops/implementation/ValidateCropsProvider';
import { ValidateAreasProvider } from '@modules/rural_propertie/provider/validate-areas/implementation/ValidateAreasProvider';
import { buildError } from '@shared/utils/buildError';
import { buildSuccess } from '@shared/utils/buildSuccess';
import { ProducerNotExistsError } from '@modules/producer/error/ProducerNotExistsError';
import { CpfOrCnpjExistsError } from '@modules/producer/error/CpfOrCnpjExistsError';
import { RuralPropertieNotExistsError } from '@modules/rural_propertie/error/RuralPropertieNotExistsError';
import { HarvestNotExistsError } from '@modules/harvest/error/HarvestNotExistsError';
import { SomeCropNotExistsError } from '@modules/crop/error/SomeCropNotExistsError';
import { ValidateAreasError } from '@modules/rural_propertie/error/ValidateAreasError';
import { Optional } from '@shared/types/Optional';
import { Producer } from '@modules/producer/entity/Producer';
import { ApplicationError } from '@shared/types/ApplicationError';
import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';
import { Harvest } from '@modules/harvest/entity/Harvest';
import { Crop } from '@modules/crop/entity/Crop';
import { CreateCropsPlantedError } from '@modules/crop/error/CreateCropsPlantedError';

describe('[USE-CASE] UpdateProducer', () => {
  let updateProducerUseCase: UpdateProducerUseCase;
  let producerRepository: jest.Mocked<ProducerRepository>;
  let ruralPropertieRepository: jest.Mocked<RuralPropertieRepository>;
  let harvestRepository: jest.Mocked<HarvestRepository>;
  let cropsPlantedRepository: jest.Mocked<CropsPlantedRepository>;
  let getCropsProvider: jest.Mocked<GetCropsProvider>;
  let validateCropsProvider: jest.Mocked<ValidateCropsProvider>;
  let validateAreasProvider: jest.Mocked<ValidateAreasProvider>;

  const mockProducer = {
    uuid: 'uuid',
    name: 'name',
    cpfOrCnpj: '12345678901',
  };

  const mockRuralPropertie = {
    uuid: 'uuid',
    name: 'name',
    city: 'city',
    state: 'state',
    arableArea: 50,
    vegetationArea: 20,
    totalAreaFarm: 100,
  };

  const mockHarvest = {
    uuid: 'uuid',
    name: 'name',
  };

  const mockCrops = [{ uuid: 'uuid', name: 'name' }];

  const producerMocked = new Producer();
  const ruralPropertieMocked = new RuralPropertie();
  const harvestMocked = new Harvest();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProducerUseCase,
        {
          provide: ProducerRepository,
          useValue: {
            findByUuid: jest.fn().mockResolvedValue(mockProducer),
            findByCpfOrCnpj: jest.fn().mockResolvedValue({
              isPresent: jest.fn().mockReturnValue(false),
            }),
            getEntityManager: jest.fn().mockReturnValue({ flush: jest.fn() }),
          },
        },
        {
          provide: RuralPropertieRepository,
          useValue: {
            findByUuid: jest.fn().mockResolvedValue(mockRuralPropertie),
            getEntityManager: jest.fn().mockReturnValue({ flush: jest.fn() }),
          },
        },
        {
          provide: HarvestRepository,
          useValue: {
            findByUuid: jest.fn().mockResolvedValue(mockHarvest),
          },
        },
        {
          provide: CropsPlantedRepository,
          useValue: {
            deleteCropsPlantedByRuralPropertieUuid: jest.fn(),
            create: jest.fn().mockReturnValue(mockCrops[0]),
            insert: jest.fn(),
            getEntityManager: jest.fn().mockReturnValue({ flush: jest.fn() }),
          },
        },
        {
          provide: GetCropsProvider,
          useValue: {
            getCrops: jest.fn().mockResolvedValue(mockCrops),
          },
        },
        {
          provide: ValidateCropsProvider,
          useValue: {
            validateCrops: jest.fn().mockReturnValue(false),
          },
        },
        {
          provide: ValidateAreasProvider,
          useValue: {
            validateAreas: jest.fn().mockReturnValue(false),
          },
        },
      ],
    }).compile();

    updateProducerUseCase = module.get<UpdateProducerUseCase>(
      UpdateProducerUseCase,
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
    expect(updateProducerUseCase).toBeDefined();
  });

  it('should update a producer without attributes repassed successfully', async () => {
    const input = {
      producerUuid: 'uuid',
    };
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );

    const result = await updateProducerUseCase.execute(input);

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).not.toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(0);
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      1,
    );
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).not.toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildSuccess(producerMocked));
  });

  it('should update a producer with name and cpfOrCnpj repassed successfully', async () => {
    const input = {
      producerUuid: 'uuid',
      name: 'name',
      cpfOrCnpj: '98765432100',
    };
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );

    const result = await updateProducerUseCase.execute(input);

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledWith(
      '98765432100',
    );
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      1,
    );
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).not.toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildSuccess(producerMocked));
  });

  it('should return an error if producer does not exist', async () => {
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(null!),
    );

    const result = await updateProducerUseCase.execute({
      producerUuid: 'uuid',
    });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).not.toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(0);
    expect(producerRepository.getEntityManager().flush).not.toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      0,
    );
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new ProducerNotExistsError()));
  });

  it('should return an error if CPF or CNPJ already exists', async () => {
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );
    producerRepository.findByCpfOrCnpj.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );

    const result = await updateProducerUseCase.execute({
      producerUuid: 'uuid',
      cpfOrCnpj: '12345678901',
    });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledWith(
      '12345678901',
    );
    expect(producerRepository.getEntityManager().flush).not.toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      0,
    );
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new CpfOrCnpjExistsError()));
  });

  it('should update a rural propetie of producer with propertieName, city, state, arableArea, totalAreaFarm, vegetationArea, harvestUuid and crops repassed successfully', async () => {
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );
    ruralPropertieRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<RuralPropertie>(ruralPropertieMocked),
    );
    validateAreasProvider.validateAreas.mockReturnValueOnce(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(harvestMocked),
    );
    getCropsProvider.getCrops.mockReturnValueOnce(
      Promise.resolve([{}] as Array<Crop>),
    );
    validateCropsProvider.validateCrops.mockReturnValueOnce(false);
    cropsPlantedRepository.create.mockResolvedValueOnce({} as never);
    cropsPlantedRepository.insert.mockResolvedValueOnce({} as never);

    const result = await updateProducerUseCase.execute({
      producerUuid: 'uuid',
      ruralPropertieUuid: 'uuid',
      ruralPropertieName: 'name',
      city: 'city',
      state: 'state',
      arableArea: 10000,
      totalAreaFarm: 12000,
      vegetationArea: 2000,
      harvestUuid: 'uuid',
      crops: ['uuid'],
    });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).not.toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(0);
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      1,
    );
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalled();
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledWith(
      12000,
      10000,
      2000,
    );
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).toHaveBeenCalled();
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalledWith(['uuid']);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(1);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledWith(
      ['uuid'],
      [{}],
    );
    expect(result.isLeft()).toBeFalsy();
    expect(result.isRight()).toBeTruthy();
    expect(result.getValue()).not.toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildSuccess(producerMocked));
  });

  it('should return an error for rural propertie does not exists', async () => {
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );
    ruralPropertieRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<RuralPropertie>(null!),
    );

    const result = await updateProducerUseCase.execute({
      producerUuid: 'uuid',
      ruralPropertieUuid: 'uuid',
      ruralPropertieName: 'name',
      city: 'city',
      state: 'state',
      arableArea: 10000,
      totalAreaFarm: 12000,
      vegetationArea: 2000,
      harvestUuid: 'uuid',
      crops: ['uuid'],
    });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).not.toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(0);
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      1,
    );
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalled();
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(validateAreasProvider.validateAreas).not.toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(0);
    expect(harvestRepository.findByUuid).not.toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(0);
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).not.toHaveBeenCalled();
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).toHaveBeenCalledTimes(0);
    expect(getCropsProvider.getCrops).not.toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(0);
    expect(validateCropsProvider.validateCrops).not.toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new RuralPropertieNotExistsError()));
  });

  it('should return an error for areas values have error', async () => {
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );
    ruralPropertieRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<RuralPropertie>(ruralPropertieMocked),
    );
    validateAreasProvider.validateAreas.mockReturnValueOnce(true);

    const result = await updateProducerUseCase.execute({
      producerUuid: 'uuid',
      ruralPropertieUuid: 'uuid',
      ruralPropertieName: 'name',
      city: 'city',
      state: 'state',
      arableArea: 10000,
      totalAreaFarm: 12000,
      vegetationArea: 3000,
      harvestUuid: 'uuid',
      crops: ['uuid'],
    });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).not.toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(0);
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      1,
    );
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalled();
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledWith(
      12000,
      10000,
      3000,
    );
    expect(harvestRepository.findByUuid).not.toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(0);
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).not.toHaveBeenCalled();
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).toHaveBeenCalledTimes(0);
    expect(getCropsProvider.getCrops).not.toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(0);
    expect(validateCropsProvider.validateCrops).not.toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new ValidateAreasError()));
  });

  it('should return an error for repassed harvest does not exists', async () => {
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );
    ruralPropertieRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<RuralPropertie>(ruralPropertieMocked),
    );
    validateAreasProvider.validateAreas.mockReturnValueOnce(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(null!),
    );

    const result = await updateProducerUseCase.execute({
      producerUuid: 'uuid',
      ruralPropertieUuid: 'uuid',
      ruralPropertieName: 'name',
      city: 'city',
      state: 'state',
      arableArea: 10000,
      totalAreaFarm: 12000,
      vegetationArea: 2000,
      harvestUuid: 'uuid',
      crops: ['uuid'],
    });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).not.toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(0);
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      1,
    );
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalled();
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledWith(
      12000,
      10000,
      2000,
    );
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).not.toHaveBeenCalled();
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).toHaveBeenCalledTimes(0);
    expect(getCropsProvider.getCrops).not.toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(0);
    expect(validateCropsProvider.validateCrops).not.toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(0);
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new HarvestNotExistsError()));
  });

  it('should return an error for some crops repassed does not exists', async () => {
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );
    ruralPropertieRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<RuralPropertie>(ruralPropertieMocked),
    );
    validateAreasProvider.validateAreas.mockReturnValueOnce(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(harvestMocked),
    );
    getCropsProvider.getCrops.mockReturnValueOnce(
      Promise.resolve([] as Array<Crop>),
    );
    validateCropsProvider.validateCrops.mockReturnValueOnce(true);

    const result = await updateProducerUseCase.execute({
      producerUuid: 'uuid',
      ruralPropertieUuid: 'uuid',
      ruralPropertieName: 'name',
      city: 'city',
      state: 'state',
      arableArea: 10000,
      totalAreaFarm: 12000,
      vegetationArea: 2000,
      harvestUuid: 'uuid',
      crops: ['uuid'],
    });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).not.toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(0);
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      1,
    );
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalled();
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledWith(
      12000,
      10000,
      2000,
    );
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).toHaveBeenCalled();
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalledWith(['uuid']);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(1);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledWith(
      ['uuid'],
      [],
    );
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new SomeCropNotExistsError()));
  });

  it('should return an error for errors on save new crops related rural propertie', async () => {
    producerRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Producer>(producerMocked),
    );
    ruralPropertieRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<RuralPropertie>(ruralPropertieMocked),
    );
    validateAreasProvider.validateAreas.mockReturnValueOnce(false);
    harvestRepository.findByUuid.mockResolvedValueOnce(
      Optional.create<Harvest>(harvestMocked),
    );
    getCropsProvider.getCrops.mockReturnValueOnce(
      Promise.resolve([{}] as Array<Crop>),
    );
    validateCropsProvider.validateCrops.mockReturnValueOnce(false);
    cropsPlantedRepository.create.mockReturnValueOnce(null!);
    cropsPlantedRepository.insert.mockResolvedValueOnce(null!);

    const result = await updateProducerUseCase.execute({
      producerUuid: 'uuid',
      ruralPropertieUuid: 'uuid',
      ruralPropertieName: 'name',
      city: 'city',
      state: 'state',
      arableArea: 10000,
      totalAreaFarm: 12000,
      vegetationArea: 2000,
      harvestUuid: 'uuid',
      crops: ['uuid'],
    });

    expect(producerRepository.findByUuid).toHaveBeenCalled();
    expect(producerRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(producerRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(producerRepository.findByCpfOrCnpj).not.toHaveBeenCalled();
    expect(producerRepository.findByCpfOrCnpj).toHaveBeenCalledTimes(0);
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalled();
    expect(producerRepository.getEntityManager().flush).toHaveBeenCalledTimes(
      1,
    );
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalled();
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(ruralPropertieRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(validateAreasProvider.validateAreas).toHaveBeenCalled();
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledTimes(1);
    expect(validateAreasProvider.validateAreas).toHaveBeenCalledWith(
      12000,
      10000,
      2000,
    );
    expect(harvestRepository.findByUuid).toHaveBeenCalled();
    expect(harvestRepository.findByUuid).toHaveBeenCalledTimes(1);
    expect(harvestRepository.findByUuid).toHaveBeenCalledWith('uuid');
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).toHaveBeenCalled();
    expect(
      ruralPropertieRepository.getEntityManager().flush,
    ).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalled();
    expect(getCropsProvider.getCrops).toHaveBeenCalledTimes(1);
    expect(getCropsProvider.getCrops).toHaveBeenCalledWith(['uuid']);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalled();
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledTimes(1);
    expect(validateCropsProvider.validateCrops).toHaveBeenCalledWith(
      ['uuid'],
      [{}],
    );
    expect(result.isLeft()).toBeTruthy();
    expect(result.isRight()).toBeFalsy();
    expect(result.getValue()).toBeInstanceOf(ApplicationError);
    expect(result).toEqual(buildError(new CreateCropsPlantedError()));
  });
});
