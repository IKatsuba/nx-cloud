import { Module } from '@nestjs/common';
import { ApiOrgAndWorkspaceController } from './api-org-and-workspace.controller';

@Module({
  controllers: [ApiOrgAndWorkspaceController],
  providers: [],
  exports: [],
})
export class ApiOrgAndWorkspaceModule {}
