import { ApplicationError } from '@shared/types/ApplicationError';
import { Either } from '@shared/types/Either';
import { IUseCase } from '@shared/types/UseCase';
import { DashboardDataDTO } from '../dto/DashboardDataDTO';

export type IGetDataDashboardOutput = Either<
  ApplicationError,
  DashboardDataDTO
>;
export interface IGetDataDashboardUseCase
  extends IUseCase<unknown, IGetDataDashboardOutput> {}
