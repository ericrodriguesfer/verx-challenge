import { Either } from '@shared/types/Either';
import { Crop } from '../entity/Crop';
import { IUseCase } from '@shared/types/UseCase';
import { ApplicationError } from '@shared/types/ApplicationError';

export interface IGetCropByUuidInput {
  uuid: string;
}
export type IGetCropByUuidOutput = Either<ApplicationError, Crop>;
export interface IGetCropByUuidUseCase
  extends IUseCase<IGetCropByUuidInput, IGetCropByUuidOutput> {}
