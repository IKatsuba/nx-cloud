import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { WorkspaceService } from './workspace.service';
import { WorkspaceEntity } from './workspace.entity';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let workspaceRepository: DeepMocked<EntityRepository<WorkspaceEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: createMock<EntityRepository<WorkspaceEntity>>(),
        },
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
    workspaceRepository = module.get(getRepositoryToken(WorkspaceEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a workspace by id', async () => {
    const id = 'test';
    const workspace = createMock<WorkspaceEntity>();

    workspaceRepository.findOne.mockResolvedValue(
      Promise.resolve(workspace as any)
    );

    const result = await service.getWorkspace(id);

    expect(workspaceRepository.findOne).toHaveBeenCalledWith(id);
    expect(result).toEqual(workspace);
  });

  it('should check if a workspace is enabled', async () => {
    const id = 'test';
    const workspace = createMock<WorkspaceEntity>();
    workspace.distributedBuildsEnabled = true;

    workspaceRepository.findOne.mockResolvedValue(
      Promise.resolve(workspace as any)
    );

    const result = await service.isEnabled(id);

    expect(workspaceRepository.findOne).toHaveBeenCalledWith(id);
    expect(result).toEqual(true);
  });
});
