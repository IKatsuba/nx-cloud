import { TaskEntity, TaskService } from '@nx-cloud/api/db/entities';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { EntityRepository } from '@mikro-orm/postgresql';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: DeepMocked<EntityRepository<TaskEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: createMock<EntityRepository<TaskEntity>>(),
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get(getRepositoryToken(TaskEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should mark tasks as completed', async () => {
    const executionId = 'test';
    const completedTaskIds = ['test1', 'test2'];

    taskRepository.nativeUpdate.mockResolvedValue(Promise.resolve(undefined));

    await service.markCompleted(executionId, completedTaskIds);

    expect(taskRepository.nativeUpdate).toHaveBeenCalledWith(
      { execution: { id: executionId }, taskId: { $in: completedTaskIds } },
      { isCompleted: true }
    );
  });

  it('should find incomplete tasks', async () => {
    const executionId = 'test';
    const tasks = [createMock<TaskEntity>()];

    taskRepository.find.mockResolvedValue(Promise.resolve(tasks));

    const result = await service.findIncomplete(executionId);

    expect(taskRepository.find).toHaveBeenCalledWith({
      execution: { id: executionId },
      isCompleted: false,
    });
    expect(result).toEqual(tasks);
  });
});
