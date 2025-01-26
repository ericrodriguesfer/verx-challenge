import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { RuralPropertie } from './entity/RuralPropertie';
import { ValidateAreasProvider } from './provider/validate-areas/implementation/ValidateAreasProvider';
import { RuralPropertieController } from './controller/RuralPropertie.controller';
import { GetDataDashboardUseCase } from './use-case/implementation/GetDataDashboardUseCase';

@Module({
  imports: [MikroOrmModule.forFeature([RuralPropertie])],
  controllers: [RuralPropertieController],
  providers: [ValidateAreasProvider, GetDataDashboardUseCase],
  exports: [ValidateAreasProvider],
})
export class RuralPropertieModule {}
