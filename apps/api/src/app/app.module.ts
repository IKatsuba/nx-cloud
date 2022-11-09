import { Module } from '@nestjs/common';
import { ApiOrgAndWorkspaceModule } from '@nx-cloud/api/http/org-and-workspace';
import { ApiRunsModule } from '@nx-cloud/api/http/runs';
import { ApiSaveMetricsModule } from '@nx-cloud/api/http/save-metrics';
import { ApiReportClientErrorModule } from '@nx-cloud/api/http/report-client-error';
import { FirebaseStorageModule } from '@nx-cloud/api/storage';

@Module({
  imports: [
    ApiOrgAndWorkspaceModule,
    ApiRunsModule.forRoot({ imports: [FirebaseStorageModule] }),
    ApiSaveMetricsModule,
    ApiReportClientErrorModule,
  ],
})
export class AppModule {}
