import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { CropController } from './controller/Crop.controller';
import { Crop } from './entity/Crop';
import { ListAllCropsUseCase } from './use-case/implementation/ListAllCropsUseCase';
import { CropsPlanted } from './entity/CropsPlanted';
import { GetCropsProvider } from './provider/get-crops/implementation/GetCropsProviders';
import { ValidateCropsProvider } from './provider/get-crops/implementation/ValidateCropsProvider';

@Module({
  imports: [MikroOrmModule.forFeature([Crop, CropsPlanted])],
  controllers: [CropController],
  providers: [ListAllCropsUseCase, ValidateCropsProvider, GetCropsProvider],
  exports: [ValidateCropsProvider, GetCropsProvider],
})
export class CropModule {}
