import { Body, Controller, Post } from '@nestjs/common';

@Controller('create-org-and-workspace')
export class ApiOrgAndWorkspaceController {
  @Post()
  createOrgAndWorkspace(
    @Body() body: { workspaceName: string; installationSource: string }
  ) {
    console.log(body);

    return {
      url: 'http://localhost:3333',
      token: 'token',
    };
  }
}
