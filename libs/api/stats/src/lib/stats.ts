import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Task, Workspace } from '@nx-turbo/api-models';

@Injectable()
export abstract class Stats {
  abstract addRequest(workspace: Workspace, request: Request): Promise<void>;

  abstract createGetSignedUrl(
    workspace: Workspace,
    data: {
      runGroup: string;
      hashes: string[];
      branch: string;
    }
  ): Promise<void>;

  abstract createPutSignedUrl(
    workspace: Workspace,
    data: {
      runGroup: string;
      hashes: string[];
      branch: string;
    }
  ): Promise<void>;

  abstract trackTaskExecutionTime(
    workspace: Workspace,
    task: Task,
    executionTime: number,
    savedTime: number
  ): Promise<void>;
}
