import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@nx-turbo/api-models';
import { TokenPermission } from '@nx-turbo/api-auth';
import { prisma } from '@nx-turbo/api-db-entities';

@Controller('create-org-and-workspace')
export class ApiOrgAndWorkspaceController {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Environment>
  ) {}

  @Post()
  async createOrgAndWorkspace(
    @Body() body: { workspaceName: string; installationSource: string }
  ) {
    const workspace = await prisma.workspace.create({
      data: {
        name: body.workspaceName,
      },
    });

    return {
      url: 'http://localhost:3333',
      token: this.jwtService.sign(
        {
          workspaceId: workspace.id,
          permissions: [TokenPermission.ReadCache, TokenPermission.WriteCache],
        },
        {
          secret: this.configService.get('JWT_SECRET'),
        }
      ),
    };
  }
}
