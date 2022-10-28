import { Module } from '@nestjs/common';
import { ApiOrgAndWorkspaceModule } from '@nx-cloud/api/org-and-workspace';
import { ApiRunsModule } from '@nx-cloud/api/runs';
import { ApiSaveMetricsModule } from '@nx-cloud/api/save-metrics';
import { ApiReportClientErrorModule } from '@nx-cloud/api/report-client-error';

@Module({
  imports: [
    ApiOrgAndWorkspaceModule,
    ApiRunsModule,
    ApiSaveMetricsModule,
    ApiReportClientErrorModule,
  ],
})
export class AppModule {}
