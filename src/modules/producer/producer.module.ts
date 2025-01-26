import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { Producer } from './entity/Producer';
import { ProducerController } from './controller/Producer.controller';
import { ListAllProducersUseCase } from './use-case/implementation/ListAllProducersUseCase';
import { CreateProducerUseCase } from './use-case/implementation/CreateProducerUseCase';
import { RuralPropertie } from '@modules/rural_propertie/entity/RuralPropertie';
import { CropsPlanted } from '@modules/crop/entity/CropsPlanted';
import { Harvest } from '@modules/harvest/entity/Harvest';
import { DeleteProducerUseCase } from './use-case/implementation/DeleteProducerUseCase';
import { UpdateProducerUseCase } from './use-case/implementation/UpdateProducerUseCase';
import { CropModule } from '@modules/crop/crop.module';
import { RuralPropertieModule } from '@modules/rural_propertie/rural_propertie.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Producer,
      RuralPropertie,
      CropsPlanted,
      Harvest,
    ]),
    CropModule,
    RuralPropertieModule,
  ],
  controllers: [ProducerController],
  providers: [
    ListAllProducersUseCase,
    CreateProducerUseCase,
    DeleteProducerUseCase,
    UpdateProducerUseCase,
  ],
})
export class ProducerModule {}
