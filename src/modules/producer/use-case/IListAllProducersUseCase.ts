import { ApplicationError } from '@shared/types/ApplicationError';
import { Either } from '@shared/types/Either';
import { Producer } from '../entity/Producer';
import { IUseCase } from '@shared/types/UseCase';

export type IListAllProducersOutput = Either<ApplicationError, Producer[]>;
export interface IListAllProducersUseCase
  extends IUseCase<unknown, IListAllProducersOutput> {}
