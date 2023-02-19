import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
    MikroOrmModule.forRoot(environment.mikroOrm),
    ApiHttpOrgAndWorkspaceModule,
    ApiHttpRunsModule.forRoot({ imports: [S3StorageModule] }),
    ApiHttpSaveMetricsModule,
    ApiHttpReportClientErrorModule,
    ApiHttpPingModule,
    ApiHttpStatsModule,
    ApiHttpExecutionsModule,
  ],
})
export class AppModule {}
