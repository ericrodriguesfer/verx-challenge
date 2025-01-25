import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Harvest } from './entity/Harvest';
import { HarvestController } from './controller/Harvest.controller';
import { ListAllHarvestUseCase } from './use-case/implementation/ListAllHarvestUseCase';

@Module({
  imports: [MikroOrmModule.forFeature([Harvest])],
  controllers: [HarvestController],
  providers: [ListAllHarvestUseCase],
})
export class HarvestModule {}
