import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Producer } from './entity/Producer';
import { ProducerController } from './controller/Producer.controller';
import { ListAllProducersUseCase } from './use-case/implementation/ListAllProducersUseCase';

@Module({
  imports: [MikroOrmModule.forFeature([Producer])],
  controllers: [ProducerController],
  providers: [ListAllProducersUseCase],
})
export class ProducerModule {}
