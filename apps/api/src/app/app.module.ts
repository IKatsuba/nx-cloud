import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { environment } from '../environments/environment';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as bodyParser from 'body-parser';
import { ApiAuthModule } from '@nx-turbo/api-auth';
import { Environment } from '@nx-turbo/api-models';
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
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService<Environment>) => ({
        pinoHttp: {
          level: configService.get('LOG_LEVEL', 'info'),
          transport:
            environment.production || configService.get('ENV') !== 'development'
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                  },
                },
        },
      }),
      inject: [ConfigService],
    }),
    ApiAuthModule,
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
          limit: '100mb',
        })
      )
      .forRoutes('runs/end');
  }
}
