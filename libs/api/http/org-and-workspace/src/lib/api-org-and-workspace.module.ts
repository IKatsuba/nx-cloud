import { Module } from '@nestjs/common';
import { ApiOrgAndWorkspaceController } from './api-org-and-workspace.controller';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Workspace } from '@nx-cloud/api/db/entities';

@Module({
  imports: [JwtModule, MikroOrmModule.forFeature([Workspace])],
  controllers: [ApiOrgAndWorkspaceController],
})
export class ApiOrgAndWorkspaceModule {}
