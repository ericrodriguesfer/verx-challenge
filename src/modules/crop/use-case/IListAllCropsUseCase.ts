import { Either } from '@shared/types/Either';
import { Crop } from '../entity/Crop';
import { IUseCase } from '@shared/types/UseCase';
import { ApplicationError } from '@shared/types/ApplicationError';

export type IListAllCropsOutput = Either<ApplicationError, Crop[]>;
export interface IListAllCropsUseCase
  extends IUseCase<unknown, IListAllCropsOutput> {}
