import { Stats } from './stats';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Histogram } from 'prom-client';
import { Logger } from 'nestjs-pino';
import { Task, Workspace } from '@nx-turbo/api-models';
import { WorkspaceEntity } from '@nx-turbo/api-db-entities';

@Injectable()
export class PrometheusStats extends Stats {
  constructor(
    @InjectMetric('nx_cloud_task_execution_time')
    private readonly taskExecutionTime: Histogram<string>,
    @InjectMetric('nx_cloud_task_saved_time')
    private readonly taskSavedTime: Histogram<string>,
    private readonly logger: Logger
  ) {
    super();
  }

  addRequest(workspace: Workspace, request: Request): Promise<void> {
    return Promise.resolve(undefined);
  }

  createGetSignedUrl(
    workspace: Workspace,
    data: { runGroup: string; hashes: string[]; branch: string }
  ): Promise<void> {
    return Promise.resolve(undefined);
  }

  createPutSignedUrl(
    workspace: Workspace,
    data: { runGroup: string; hashes: string[]; branch: string }
  ): Promise<void> {
    return Promise.resolve(undefined);
  }

  trackTaskExecutionTime(
    workspace: WorkspaceEntity,
    task: Task,
    executionTime: number,
    savedTime: number
  ): Promise<void> {
    this.logger.debug(
      `Task ${task.taskId} for project ${task.projectName} took ${executionTime}ms to execute and ${savedTime}ms to save`
    );

    this.taskExecutionTime
      .labels({
        workspaceName: workspace.name,
        project: task.projectName,
        taskId: task.taskId,
        target: task.target,
      })
      .observe(executionTime);

    this.taskSavedTime
      .labels({
        workspaceName: workspace.name,
        project: task.projectName,
        taskId: task.taskId,
        target: task.target,
      })
      .observe(savedTime);

    return Promise.resolve(undefined);
  }
}
