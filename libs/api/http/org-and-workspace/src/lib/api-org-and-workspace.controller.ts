import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('create-org-and-workspace')
export class ApiOrgAndWorkspaceController {
  constructor(private jwtService: JwtService) {}

  @Post()
  createOrgAndWorkspace(
    @Body() body: { workspaceName: string; installationSource: string }
  ) {
    console.log(body);

    return {
      url: 'http://localhost:3333',
      token: this.jwtService.sign(
        { workspaceName: body.workspaceName },
        {
          secret: process.env.JWT_SECRET,
        }
      ),
    };
  }
}
