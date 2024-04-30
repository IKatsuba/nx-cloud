import { Test } from '@nestjs/testing';
import { ApiOrgAndWorkspaceController } from './api-org-and-workspace.controller';
import { JwtService } from '@nestjs/jwt';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';

describe('ApiOrgAndWorkspaceController', () => {
  let controller: ApiOrgAndWorkspaceController;
  let jwtService: DeepMocked<JwtService>;
  let workspaceRepository: DeepMocked<EntityRepository<WorkspaceEntity>>;
  let configService: DeepMocked<ConfigService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ApiOrgAndWorkspaceController],
      providers: [
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: createMock<EntityRepository<WorkspaceEntity>>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    controller = module.get(ApiOrgAndWorkspaceController);
    jwtService = module.get(JwtService);
    workspaceRepository = module.get(getRepositoryToken(WorkspaceEntity));
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should create org and workspace', async () => {
    expect.assertions(1);

    const workspace = new WorkspaceEntity();
    workspace.name = 'test-workspace';

    configService.get.mockReturnValue('test-secret');
    jwtService.sign.mockReturnValue('test-token');
    workspaceRepository.nativeInsert.mockReturnValue(Promise.resolve('1'));

    const result = await controller.createOrgAndWorkspace({
      workspaceName: 'test-workspace',
      installationSource: 'test-source',
    });

    expect(result).toEqual({
      url: 'http://localhost:3333',
      token: 'test-token',
    });
  });
});
