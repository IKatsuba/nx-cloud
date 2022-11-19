import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Workspace } from '@nx-cloud/api/db/entities';
import { EntityRepository } from '@mikro-orm/core';
import { TokenPermission } from '@nx-cloud/api/auth';

@Controller('create-org-and-workspace')
export class ApiOrgAndWorkspaceController {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Workspace)
    private workspaceRepository: EntityRepository<Workspace>
  ) {}

  @Post()
  async createOrgAndWorkspace(
    @Body() body: { workspaceName: string; installationSource: string }
  ) {
    const workspace = new Workspace();
    workspace.name = body.workspaceName;

    const workspaceId = await this.workspaceRepository.nativeInsert(workspace);

    return {
      url: 'http://localhost:3333',
      token: this.jwtService.sign(
        {
          workspaceName: body.workspaceName,
          workspaceId,
          permissions: [TokenPermission.ReadCache, TokenPermission.WriteCache],
        },
        {
          secret: process.env.JWT_SECRET,
        }
      ),
    };
  }
}
