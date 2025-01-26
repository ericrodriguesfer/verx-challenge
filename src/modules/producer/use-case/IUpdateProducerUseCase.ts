import { IUseCase } from '@shared/types/UseCase';
import { UpdateProducerDTO } from '../dto/UpdateProducerDTO';
import { Either } from '@shared/types/Either';
import { ApplicationError } from '@shared/types/ApplicationError';
import { Producer } from '../entity/Producer';

export interface IUpdateProducerParams {
  producerUuid: string;
  ruralPropertieUuid?: string;
}
export type IUpdateProducerInput = UpdateProducerDTO & IUpdateProducerParams;
export type IUpdateProducerOutput = Either<ApplicationError, Producer>;
export interface IUpdateProducerUseCase
  extends IUseCase<IUpdateProducerInput, IUpdateProducerOutput> {}
