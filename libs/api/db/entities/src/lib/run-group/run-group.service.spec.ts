import { Test } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { EntityRepository } from '@mikro-orm/postgresql';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import {
  ExecutionEntity,
  RunGroupEntity,
  RunGroupService,
  WorkspaceEntity,
} from '@nx-cloud/api/db/entities';
import { Collection } from '@mikro-orm/core';

describe('RunGroupService', () => {
  let service: RunGroupService;
  let runGroupRepository: DeepMocked<EntityRepository<RunGroupEntity>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RunGroupService,
        {
          provide: getRepositoryToken(RunGroupEntity),
          useValue: createMock<EntityRepository<RunGroupEntity>>(),
        },
      ],
    }).compile();

    service = module.get<RunGroupService>(RunGroupService);
    runGroupRepository = module.get(getRepositoryToken(RunGroupEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create run group', async () => {
    const runGroup = 'test';
    const branch = 'main';
    const workspace = createMock<WorkspaceEntity>();

    runGroupRepository.persistAndFlush.mockResolvedValue(Promise.resolve());

    const result = await service.createRunGroup({
      runGroup,
      branch,
      workspace,
    });

    const runGroupEntity = new RunGroupEntity();
    runGroupEntity.runGroup = runGroup;
    runGroupEntity.branch = branch;
    runGroupEntity.workspace = workspace;

    expect(result).toEqual(runGroupEntity);
  });

  it('should find run group', async () => {
    const runGroup = 'test';

    runGroupRepository.findOne.mockResolvedValue(
      Promise.resolve(new RunGroupEntity() as any)
    );

    const result = await service.findOne(runGroup);

    expect(result).toBeInstanceOf(RunGroupEntity);
  });

  it('should complete run group', async () => {
    const runGroup = 'test';

    const runGroupEntity = createMock<RunGroupEntity>();

    runGroupEntity.executions = createMock<Collection<ExecutionEntity>>();

    (
      runGroupEntity.executions as DeepMocked<Collection<ExecutionEntity>>
    ).init.mockResolvedValue(Promise.resolve(undefined));

    runGroupRepository.findOne.mockResolvedValue(
      Promise.resolve(runGroupEntity as any)
    );

    await service.completeRunGroup(runGroup);

    expect(runGroupEntity.isCompleted).toEqual(true);
  });
});
