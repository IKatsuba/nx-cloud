import { Module } from '@nestjs/common';
import { ApiOrgAndWorkspaceController } from './api-org-and-workspace.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [ApiOrgAndWorkspaceController],
  providers: [],
  exports: [],
})
export class ApiOrgAndWorkspaceModule {}
