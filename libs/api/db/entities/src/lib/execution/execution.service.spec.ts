import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Collection } from '@mikro-orm/core';
import { ExecutionService } from './execution.service';
import { ExecutionEntity } from './execution.entity';
import { TaskEntity } from '../task/task.entity';
import { RunGroupEntity } from '../run-group/run-group.entity';

describe('ExecutionService', () => {
  let service: ExecutionService;
  let executionRepository: DeepMocked<EntityRepository<ExecutionEntity>>;
  let taskRepository: DeepMocked<EntityRepository<TaskEntity>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExecutionService,
        {
          provide: getRepositoryToken(ExecutionEntity),
          useValue: createMock<EntityRepository<ExecutionEntity>>(),
        },
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: createMock<EntityRepository<TaskEntity>>(),
        },
      ],
    }).compile();

    service = module.get<ExecutionService>(ExecutionService);

    executionRepository = module.get(getRepositoryToken(ExecutionEntity));
    taskRepository = module.get(getRepositoryToken(TaskEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create execution', async () => {
    const runGroup = createMock<RunGroupEntity>();
    const command = 'test';
    const tasks = [createMock<TaskEntity>()];
    const maxParallel = 1;

    executionRepository.persistAndFlush.mockResolvedValue(Promise.resolve());

    const result = await service.createExecution({
      runGroup,
      command,
      tasks,
      maxParallel,
    });

    const executionEntity = new ExecutionEntity();
    executionEntity.runGroup = runGroup;
    executionEntity.command = command;
    executionEntity.tasks = expect.any(Collection);
    executionEntity.maxParallel = maxParallel;
    executionEntity.id = expect.any(String);

    expect(result).toEqual(executionEntity);
  });

  it('should find one', async () => {
    const id = 'test';
    const execution = createMock<ExecutionEntity>();

    executionRepository.createQueryBuilder.mockReturnValue({
      where: jest.fn().mockReturnValue({
        getSingleResult: jest.fn().mockResolvedValue(execution),
      }),
    } as any);

    const result = await service.findOne(id);

    expect(result).toEqual(execution);
  });

  it('should complete execution', async () => {
    const execution = createMock<ExecutionEntity>();

    executionRepository.upsert.mockResolvedValue(Promise.resolve({} as any));

    await service.completeExecution(execution);

    expect(execution.isCompleted).toEqual(true);
  });

  it('should find first incomplete', async () => {
    const runGroup = 'test';
    const execution = new ExecutionEntity();

    executionRepository.findOne.mockReturnValue(
      Promise.resolve(execution as any)
    );

    const result = await service.findFirstIncomplete(runGroup);

    expect(result).toEqual(execution);
  });

  it('should set status code', async () => {
    const id = 'test';
    const statusCode = 1;

    executionRepository.nativeUpdate.mockResolvedValue(
      Promise.resolve({} as any)
    );

    await service.setStatusCode(id, statusCode);

    expect(executionRepository.nativeUpdate).toHaveBeenCalledWith(
      { id },
      { statusCode }
    );
  });
});
