import { Injectable } from '@nestjs/common';
import { Task, Workspace } from '@nx-cloud/api/models';
import { Request } from 'express';

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
