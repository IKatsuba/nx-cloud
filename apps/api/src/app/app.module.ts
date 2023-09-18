import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { environment } from '../environments/environment';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/postgresql';

import * as bodyParser from 'body-parser';
import { ApiAuthModule } from '@nx-turbo/api-auth';
import { Environment } from '@nx-turbo/api-models';
import {
  ExecutionEntity,
  TaskEntity,
  WorkspaceEntity,
} from '@nx-turbo/api-db-entities';
import { ApiHttpOrgAndWorkspaceModule } from '@nx-turbo/api-http-org-and-workspace';
import { ApiHttpRunsModule } from '@nx-turbo/api-http-runs';
import { S3StorageModule } from '@nx-turbo/api-storage';
import { ApiHttpSaveMetricsModule } from '@nx-turbo/api-http-save-metrics';
import { ApiHttpReportClientErrorModule } from '@nx-turbo/api-http-report-client-error';
import { ApiHttpPingModule } from '@nx-turbo/api-http-ping';
import { ApiHttpStatsModule } from '@nx-turbo/api-http-stats';
import { ApiHttpExecutionsModule } from '@nx-turbo/api-http-executions';
import { PrometheusStatsModule } from '@nx-turbo/api-stats';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: environment.production ? 'info' : 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }),
    ApiAuthModule,
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<Environment>) =>
        defineConfig({
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT'), 10),
          dbName: configService.get('DB_NAME'),
          password: configService.get('DB_PASSWORD', null),
          user: configService.get('DB_USER', null),
          metadataProvider: ReflectMetadataProvider,
          entities: [WorkspaceEntity, TaskEntity, ExecutionEntity],
          migrations: {
            path: './migrations',
            disableForeignKeys: false,
          },
        }),
      inject: [ConfigService],
    }),
    ApiHttpOrgAndWorkspaceModule,
    ApiHttpRunsModule.forRoot({ imports: [S3StorageModule] }),
    ApiHttpSaveMetricsModule,
    ApiHttpReportClientErrorModule,
    ApiHttpPingModule,
    ApiHttpStatsModule,
    ApiHttpExecutionsModule,
    PrometheusStatsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        bodyParser.raw({
          type: ['application/octet-stream'],
        })
      )
      .forRoutes('runs/end');
  }
}
