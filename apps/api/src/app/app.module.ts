import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApiHttpOrgAndWorkspaceModule } from '@nx-cloud/api/http/org-and-workspace';
import { ApiHttpRunsModule } from '@nx-cloud/api/http/runs';
import { ApiHttpSaveMetricsModule } from '@nx-cloud/api/http/save-metrics';
import { ApiHttpReportClientErrorModule } from '@nx-cloud/api/http/report-client-error';
import { S3StorageModule } from '@nx-cloud/api/storage';
import { ApiAuthModule } from '@nx-cloud/api/auth';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { environment } from '../environments/environment';
import { ApiHttpPingModule } from '@nx-cloud/api/http/ping';
import { ApiHttpStatsModule } from '@nx-cloud/api/http/stats';
import { ApiHttpExecutionsModule } from '@nx-cloud/api/http/executions';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment } from '@nx-cloud/api/models';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import {
  ExecutionEntity,
  TaskEntity,
  WorkspaceEntity,
} from '@nx-cloud/api/db/entities';
import * as bodyParser from 'body-parser';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environment.production ? '.env' : '.env.dev',
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
      useFactory: (configService: ConfigService<Environment>) => ({
        type: 'postgresql' as const,
        host: configService.get('DB_HOST', 'localhost'),
        port: parseInt(configService.get('DB_PORT', '5432'), 10),
        dbName: configService.get('DB_NAME', 'postgres'),
        password: configService.get('DB_PASSWORD', null),
        user: configService.get('DB_USER', null),
        metadataProvider: ReflectMetadataProvider,
        entities: [WorkspaceEntity, TaskEntity, ExecutionEntity],
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
