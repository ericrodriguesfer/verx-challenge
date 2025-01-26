import { IUseCase } from '@shared/types/UseCase';
import { CreateProducerDTO } from '../dto/CreateProducerDTO';
import { Either } from '@shared/types/Either';
import { ApplicationError } from '@shared/types/ApplicationError';
import { Producer } from '../entity/Producer';

export type ICrateProducerInput = CreateProducerDTO;
export type ICreateProducerOutput = Either<ApplicationError, Producer>;
export interface ICreateProducerUseCase
  extends IUseCase<ICrateProducerInput, ICreateProducerOutput> {}
