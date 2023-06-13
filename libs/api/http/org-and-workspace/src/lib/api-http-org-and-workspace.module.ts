import { Module } from '@nestjs/common';
import { ApiOrgAndWorkspaceController } from './api-org-and-workspace.controller';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WorkspaceEntity } from '@nx-turbo/api-db-entities';

@Module({
  imports: [JwtModule, MikroOrmModule.forFeature([WorkspaceEntity])],
  controllers: [ApiOrgAndWorkspaceController],
})
export class ApiHttpOrgAndWorkspaceModule {}
