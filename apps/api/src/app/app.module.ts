import { Module } from '@nestjs/common';
import { ApiOrgAndWorkspaceModule } from '@nx-cloud/api/http/org-and-workspace';
import { ApiRunsModule } from '@nx-cloud/api/http/runs';
import { ApiSaveMetricsModule } from '@nx-cloud/api/http/save-metrics';
import { ApiReportClientErrorModule } from '@nx-cloud/api/http/report-client-error';
import { S3StorageModule } from '@nx-cloud/api/storage';
import { ApiAuthModule } from '@nx-cloud/api/auth';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { environment } from '../environments/environment';
import { ApiHttpPingModule } from '@nx-cloud/api/http/ping';
import { ApiHttpStatsModule } from '@nx-cloud/api/http/stats';

@Module({
  imports: [
    ApiAuthModule,
    ApiOrgAndWorkspaceModule,
    ApiRunsModule.forRoot({ imports: [S3StorageModule] }),
    ApiSaveMetricsModule,
    ApiReportClientErrorModule,
    ApiHttpPingModule,
    ApiHttpStatsModule,
    MikroOrmModule.forRoot(environment.mikroOrm),
  ],
})
export class AppModule {}
