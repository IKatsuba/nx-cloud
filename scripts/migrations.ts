import { MikroORM } from '@mikro-orm/core';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../apps/api/src/app/app.module';
import { Logger } from 'nestjs-pino';

(async () => {
  const app = await NestFactory.create(AppModule, {
    autoFlushLogs: true,
    bufferLogs: true,
  });

  const logger = app.get(Logger);

  app.useLogger(logger);

  logger.log('Starting migrations...');

  const orm = app.get(MikroORM);

  const migrator = orm.getMigrator();
  await migrator.up();

  logger.log('Migrations finished.');

  await orm.close(true);
})().catch((e) => {
  console.error(e);
});
