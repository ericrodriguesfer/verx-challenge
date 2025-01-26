import { ApplicationError } from '@shared/types/ApplicationError';
import { Either } from '@shared/types/Either';
import { IUseCase } from '@shared/types/UseCase';

export interface IDeleteProducerInput {
  uuid: string;
}
export type IDeleteProducerOutput = Either<ApplicationError, boolean>;
export interface IDeleteProducerUseCase
  extends IUseCase<IDeleteProducerInput, IDeleteProducerOutput> {}
