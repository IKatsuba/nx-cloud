import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, WorkspaceId } from '@nx-cloud/api/auth';
import {
  ExecutionService,
  RunGroupService,
  TaskService,
  WorkspaceService,
} from '@nx-cloud/api/db/entities';
import { Task } from '@nx-cloud/api/models';

@UseGuards(JwtAuthGuard)
@Controller('executions')
export class ApiHttpExecutionsController {
  constructor(
    private workspaceService: WorkspaceService,
    private taskService: TaskService,
    private executionService: ExecutionService,
    private runGroupService: RunGroupService
  ) {}

  @Get('workspace-status')
  async getWorkspaceStatus(
    @WorkspaceId() workspaceId: string
  ): Promise<{ enabled: boolean }> {
    return {
      enabled: await this.workspaceService.isEnabled(workspaceId),
    };
  }

  @Post('create-run-group')
  async createRunGroup(
    @WorkspaceId() workspaceId: string,
    @Body()
    body: {
      branch: string;
      runGroup: string;
    }
  ): Promise<{ enabled: boolean }> {
    const workspace = await this.workspaceService.getWorkspace(workspaceId);

    if (!workspace.distributedBuildsEnabled) {
      return {
        enabled: false,
      };
    }

    if (await this.runGroupService.exists(body.runGroup)) {
      return { enabled: true };
    }

    await this.runGroupService.createRunGroup({
      runGroup: body.runGroup,
      branch: body.branch,
      workspace,
    });

    return {
      enabled: true,
    };
  }

  @Post('start')
  async start(
    @WorkspaceId() workspaceId: string,
    @Body()
    body: {
      branch: string;
      runGroup: string;
      command: string;
      maxParallel: number;
      tasks: Task[][];
    }
  ): Promise<{
    enabled: boolean;
    id: string;
    error: string;
  }> {
    const workspace = await this.workspaceService.getWorkspace(workspaceId);

    if (!workspace.distributedBuildsEnabled) {
      return {
        enabled: false,
        id: null,
        error: null,
      };
    }

    const runGroup =
      (await this.runGroupService.findOne(body.runGroup)) ??
      (await this.runGroupService.createRunGroup({
        runGroup: body.runGroup,
        branch: body.branch,
        workspace,
      }));

    if (!runGroup) {
      return {
        enabled: true,
        id: null,
        error: `Run group ${body.runGroup} does not exist`,
      };
    }

    const execution = await this.executionService.createExecution({
      command: body.command,
      maxParallel: body.maxParallel,
      runGroup: runGroup,
      tasks: body.tasks.flat(),
    });

    return {
      enabled: true,
      id: execution.id,
      error: null,
    };
  }

  @Post('tasks')
  async tasks(
    @WorkspaceId() workspaceId: string,
    @Body()
    body: {
      agentName: string;
      runGroup: string;
      executionId: string;
      statusCode: number;
      completedTasks: Task[];
      completedTaskIds: string[];
    }
  ): Promise<{
    completed: boolean;
    executionId: string;
    tasks: Task[];
    maxParallel: number;
    criticalErrorMessage: string;
  }> {
    const execution = body.executionId
      ? await this.executionService.findOne(body.executionId)
      : await this.executionService.findFirstIncomplete(body.runGroup);

    if (!execution) {
      return {
        completed: true,
        executionId: null,
        tasks: [],
        maxParallel: null,
        criticalErrorMessage: null,
      };
    }

    if (body.completedTaskIds) {
      await this.taskService.markCompleted(body.completedTaskIds);
    }

    if (body.statusCode !== 0) {
      await this.executionService.setStatusCode(execution.id, body.statusCode);
    }

    const tasks = await this.taskService.findIncomplete(execution.id);

    if (tasks.length === 0) {
      await this.executionService.completeExecution(execution);
    }

    return {
      completed: execution.isCompleted,
      executionId: execution.id,
      tasks,
      maxParallel: execution.maxParallel,
      criticalErrorMessage: null,
    };
  }

  @Post('status')
  async status(
    @WorkspaceId() workspaceId: string,
    @Body()
    body: {
      id: string;
    }
  ): Promise<{
    executionStatus: string;
    commandStatus: number;
    completedTasks: Array<Task & { url: string }>;
    runUrl: string;
    criticalErrorMessage: string;
  }> {
    const execution = await this.executionService.findOne(body.id);

    if (!execution) {
      return {
        executionStatus: 'NOT_FOUND',
        commandStatus: null,
        completedTasks: [],
        runUrl: null,
        criticalErrorMessage: null,
      };
    }

    if (execution.isCompleted || execution.runGroup.isCompleted) {
      return {
        executionStatus: 'complete',
        commandStatus: execution.statusCode,
        completedTasks: execution.tasks.getItems().map((t) => ({
          ...t,
          url: '/task/' + t.id,
        })),
        runUrl: '/run/' + execution.runGroup.runGroup,
        criticalErrorMessage: null,
      };
    }

    const tasks = execution.tasks;

    await tasks.init();

    const completedTasks = tasks.getItems().filter((t) => t.isCompleted);
    const completedTaskIds = completedTasks.map((t) => t.id);

    const taskUrls = completedTaskIds.map((id) => '/task/' + id);

    const completedTasksWithUrls = completedTasks.map((t) => {
      return {
        ...t,
        url: taskUrls[completedTaskIds.indexOf(t.id)],
      };
    });

    if (tasks.getItems().every((t) => t.isCompleted)) {
      await this.executionService.completeExecution(execution);
    }

    return {
      executionStatus: execution.isCompleted ? 'complete' : 'running',
      commandStatus: execution.statusCode,
      completedTasks: completedTasksWithUrls,
      runUrl: '/run/' + execution.runGroup.runGroup,
      criticalErrorMessage: null,
    };
  }

  @Post('complete-run-group')
  async completeRunGroup(
    @WorkspaceId() workspaceId: string,
    @Body()
    body: {
      runGroup: string;
      criticalErrorMessage: string;
      agentName: string;
    }
  ): Promise<'SUCCESS'> {
    await this.runGroupService.completeRunGroup(body.runGroup);

    return 'SUCCESS';
  }
}
