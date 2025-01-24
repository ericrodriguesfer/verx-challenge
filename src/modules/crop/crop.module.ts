import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { CropController } from './controller/Crop.controller';
import { GetCropByUuidUseCase } from './use-case/implementation/GetCropByUuidUseCase';
import { Crop } from './entity/Crop';
import { ListAllCropsUseCase } from './use-case/implementation/ListAllCropsUseCase';

@Module({
  imports: [MikroOrmModule.forFeature([Crop])],
  controllers: [CropController],
  providers: [GetCropByUuidUseCase, ListAllCropsUseCase],
})
export class CropModule {}
