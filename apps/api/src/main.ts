/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@nx-cloud/api/models';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    autoFlushLogs: true,
    bufferLogs: true,
  });

  const logger = app.get(Logger);

  app.useLogger(logger);

  const globalPrefix = 'nx-cloud';
  app.setGlobalPrefix(globalPrefix, { exclude: ['ping'] });

  const configService = app.get<ConfigService<Environment>>(ConfigService);

  const port = configService.get('PORT', 3333);
  await app.listen(port);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
