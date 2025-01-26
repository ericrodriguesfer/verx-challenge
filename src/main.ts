import { NestFactory } from '@nestjs/core';
import log from 'npmlog';

import { AppModule } from '@app/app.module';
import { swagger } from '@config/swagger/Swagger';
import { Prefix } from '@shared/constants/prefix';
import { ApplicationsFlowMessages } from '@shared/messages/flow';
import { ApplicationsErrorMessages } from '@shared/messages/error';
import { Env } from '@config/environment/env';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swagger.setup(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(Env.PORT ?? 3000);
  log.info(Prefix.APPLICATION, ApplicationsFlowMessages.INIT_SUCCESS);
}

bootstrap().catch((error: Error) =>
  log.error(Prefix.APPLICATION, ApplicationsErrorMessages.INIT_ERROR, error),
);
