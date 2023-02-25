import { Test } from '@nestjs/testing';
import { ApiOrgAndWorkspaceController } from './api-org-and-workspace.controller';

xdescribe('ApiOrgAndWorkspaceController', () => {
  let controller: ApiOrgAndWorkspaceController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ApiOrgAndWorkspaceController],
    }).compile();

    controller = module.get(ApiOrgAndWorkspaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
