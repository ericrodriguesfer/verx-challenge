import { ApplicationError } from '@shared/types/ApplicationError';
import { Either } from '@shared/types/Either';
import { Harvest } from '../entity/Harvest';
import { IUseCase } from '@shared/types/UseCase';

export type IListAllHarvestOutput = Either<ApplicationError, Harvest[]>;
export interface IListAllHarvestUseCase
  extends IUseCase<unknown, IListAllHarvestOutput> {}
