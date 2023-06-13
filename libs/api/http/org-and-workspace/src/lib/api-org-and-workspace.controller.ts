import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { WorkspaceEntity } from '@nx-turbo/api-db-entities';
import { Environment } from '@nx-turbo/api-models';
import { TokenPermission } from '@nx-turbo/api-auth';

@Controller('create-org-and-workspace')
export class ApiOrgAndWorkspaceController {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: EntityRepository<WorkspaceEntity>,
    private configService: ConfigService<Environment>
  ) {}

  @Post()
  async createOrgAndWorkspace(
    @Body() body: { workspaceName: string; installationSource: string }
  ) {
    const workspace = new WorkspaceEntity();
    workspace.name = body.workspaceName;

    const workspaceId = await this.workspaceRepository.nativeInsert(workspace);

    return {
      url: 'http://localhost:3333',
      token: this.jwtService.sign(
        {
          workspaceId,
          permissions: [TokenPermission.ReadCache, TokenPermission.WriteCache],
        },
        {
          secret: this.configService.get('JWT_SECRET'),
        }
      ),
    };
  }
}
