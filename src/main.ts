import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from '@app/app.module';
import { swagger } from '@config/swagger/Swagger';
import { Env } from '@config/environment/env';
import { ApplicationsErrorMessages } from '@shared/messages/error';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      prefix: 'VERX-CHALLENGE',
    }),
  });
  swagger.setup(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(Env.PORT ?? 3000);
}

const logger = new Logger('Main');

bootstrap().catch((error: Error) =>
  logger.error(ApplicationsErrorMessages.INIT_ERROR, error),
);
