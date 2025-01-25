import { Injectable } from '@nestjs/common';
import {
  IListAllHarvestOutput,
  IListAllHarvestUseCase,
} from '../IListAllHarvestUseCase';
import { HarvestRepository } from '@modules/harvest/repository/implementation/HarvestRepository';
import { buildSuccess } from '@shared/utils/buildSuccess';

@Injectable()
export class ListAllHarvestUseCase implements IListAllHarvestUseCase {
  constructor(private readonly harvestRepository: HarvestRepository) {}

  async execute(): Promise<IListAllHarvestOutput> {
    const harvests = await this.harvestRepository.findAll();

    return buildSuccess(harvests);
  }
}
