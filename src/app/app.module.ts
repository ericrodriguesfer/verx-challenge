import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

import { Env } from '@config/environment/env';
import { CropModule } from '@modules/crop/crop.module';
import { HarvestModule } from '@modules/harvest/harvest.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot({
      entities: ['./dist/src/modules/**/entity'],
      entitiesTs: ['./src/modules/**/entity'],
      autoLoadEntities: true,
      driver: PostgreSqlDriver,
      host: Env.DB_HOST,
      user: Env.DB_USER,
      password: Env.DB_PASS,
      dbName: Env.DB_NAME,
      port: parseInt(Env.DB_PORT),
      pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 15000,
      },
    }),
    CropModule,
    HarvestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
