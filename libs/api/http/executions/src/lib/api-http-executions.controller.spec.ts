import { Test } from '@nestjs/testing';
import { ApiHttpExecutionsController } from './api-http-executions.controller';

import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  ExecutionService,
  RunGroupService,
  TaskService,
  WorkspaceService,
} from '@nx-turbo/api-db-entities';

describe('ApiHttpExecutionsController', () => {
  let controller: ApiHttpExecutionsController;

  let workspaceService: DeepMocked<WorkspaceService>;
  let taskService: DeepMocked<TaskService>;
  let executionService: DeepMocked<ExecutionService>;
  let runGroupService: DeepMocked<RunGroupService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: WorkspaceService,
          useValue: createMock<WorkspaceService>(),
        },
        {
          provide: TaskService,
          useValue: createMock<TaskService>(),
        },
        {
          provide: ExecutionService,
          useValue: createMock<ExecutionService>(),
        },
        {
          provide: RunGroupService,
          useValue: createMock<RunGroupService>(),
        },
      ],
      controllers: [ApiHttpExecutionsController],
    }).compile();

    controller = module.get(ApiHttpExecutionsController);
    workspaceService = module.get(WorkspaceService);
    taskService = module.get(TaskService);
    executionService = module.get(ExecutionService);
    runGroupService = module.get(RunGroupService);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  describe('GET workspace-status', () => {
    it('should get workspace status', async () => {
      expect.assertions(2);

      const workspaceId = '123';

      workspaceService.isEnabled.mockReturnValue(Promise.resolve(true));
      const result = await controller.getWorkspaceStatus(workspaceId);
      expect(workspaceService.isEnabled).toHaveBeenCalledWith(workspaceId);
      expect(result).toEqual({ enabled: true });
    });
  });

  describe('POST create-run-group', () => {
    it('should return existing run group', async () => {
      expect.assertions(3);

      const workspaceId = '123';
      const body = {
        branch: 'main',
        runGroup: '123',
      };

      workspaceService.getWorkspace.mockReturnValue(
        Promise.resolve({ distributedBuildsEnabled: true } as any)
      );
      runGroupService.exists.mockReturnValue(Promise.resolve(true));
      const result = await controller.createRunGroup(workspaceId, body);
      expect(workspaceService.getWorkspace).toHaveBeenCalledWith(workspaceId);
      expect(runGroupService.exists).toHaveBeenCalledWith(body.runGroup);
      expect(result).toEqual({ enabled: true });
    });

    it('should create run group', async () => {
      expect.assertions(4);

      const workspaceId = '123';
      const body = {
        branch: 'main',
        runGroup: '123',
      };

      workspaceService.getWorkspace.mockReturnValue(
        Promise.resolve({ distributedBuildsEnabled: true } as any)
      );
      runGroupService.exists.mockReturnValue(Promise.resolve(false));
      const result = await controller.createRunGroup(workspaceId, body);
      expect(workspaceService.getWorkspace).toHaveBeenCalledWith(workspaceId);
      expect(runGroupService.exists).toHaveBeenCalledWith(body.runGroup);
      expect(runGroupService.createRunGroup).toHaveBeenCalledWith({
        runGroup: body.runGroup,
        branch: body.branch,
        workspace: {
          distributedBuildsEnabled: true,
        },
      });
      expect(result).toEqual({ enabled: true });
    });

    it('should not create run group', async () => {
      expect.assertions(2);

      const workspaceId = '123';
      const body = {
        branch: 'main',
        runGroup: '123',
      };

      workspaceService.getWorkspace.mockReturnValue(
        Promise.resolve({ distributedBuildsEnabled: false } as any)
      );
      const result = await controller.createRunGroup(workspaceId, body);
      expect(workspaceService.getWorkspace).toHaveBeenCalledWith(workspaceId);
      expect(result).toEqual({ enabled: false });
    });
  });

  describe('POST start', () => {
    it('should create execution', async () => {
      expect.assertions(2);

      const workspaceId = '123';
      const body = {
        branch: 'main',
        runGroup: '123',
        command: 'build',
        maxParallel: 2,
        tasks: [],
      };

      workspaceService.getWorkspace.mockReturnValue(
        Promise.resolve({ distributedBuildsEnabled: true } as any)
      );
      executionService.createExecution.mockReturnValue(
        Promise.resolve({ id: '123' } as any)
      );
      const result = await controller.start(workspaceId, body);
      expect(workspaceService.getWorkspace).toHaveBeenCalledWith(workspaceId);
      expect(result).toEqual({
        enabled: true,
        error: null,
        id: '123',
      });
    });

    it('should not create execution', async () => {
      expect.assertions(2);

      const workspaceId = '123';
      const body = {
        branch: 'main',
        runGroup: '123',
        command: 'build',
        maxParallel: 2,
        tasks: [],
      };

      workspaceService.getWorkspace.mockReturnValue(
        Promise.resolve({ distributedBuildsEnabled: false } as any)
      );
      const result = await controller.start(workspaceId, body);
      expect(workspaceService.getWorkspace).toHaveBeenCalledWith(workspaceId);
      expect(result).toEqual({
        enabled: false,
        error: null,
        id: null,
      });
    });
  });

  describe('POST tasks', () => {
    it("should return 'complete: false' of there is no execution", async () => {
      expect.assertions(2);

      const workspaceId = '123';
      const body = {
        agentName: 'agent',
        runGroup: '123',
        executionId: '123',
        statusCode: 0,
        completedTasks: [],
      };

      executionService.findOne.mockReturnValue(Promise.resolve(null));

      const result = await controller.tasks(workspaceId, body);
      expect(executionService.findOne).toHaveBeenCalledWith(body.executionId);

      expect(result).toEqual({
        completed: false,
        criticalErrorMessage: null,
        executionId: null,
        maxParallel: null,
        tasks: [],
      });
    });

    it("should return 'complete: false' of there is no executionId and no incomplete execution", async () => {
      expect.assertions(2);

      const workspaceId = '123';
      const body = {
        agentName: 'agent',
        runGroup: '123',
        statusCode: 0,
        completedTasks: [],
      };

      executionService.findFirstIncomplete.mockReturnValue(
        Promise.resolve(null)
      );

      const result = await controller.tasks(workspaceId, body);
      expect(executionService.findFirstIncomplete).toHaveBeenCalledWith(
        body.runGroup
      );

      expect(result).toEqual({
        completed: false,
        criticalErrorMessage: null,
        executionId: null,
        maxParallel: null,
        tasks: [],
      });
    });
  });
});
