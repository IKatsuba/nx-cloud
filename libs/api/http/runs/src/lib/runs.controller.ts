import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { lastValueFrom, merge, reduce } from 'rxjs';
import { Storage } from '@nx-cloud/api/storage';
import {
  JwtAuthGuard,
  TokenPermission,
  TokenPermissions,
  WorkspaceId,
} from '@nx-cloud/api/auth';
import { RunGroup, Task } from '@nx-cloud/api/models';
import {
  ExecutionService,
  RunGroupService,
  WorkspaceService,
} from '@nx-cloud/api/db/entities';

@UseGuards(JwtAuthGuard)
@Controller('runs')
export class RunsController {
  constructor(
    private storage: Storage,
    private runGroupService: RunGroupService,
    private executionService: ExecutionService,
    private workspaceService: WorkspaceService
  ) {}

  @Post('start')
  async start(
    @Body('hashes') hashes: string[],
    @TokenPermissions() permissions: TokenPermission[]
  ) {
    const urls = await lastValueFrom(
      merge(
        ...hashes.map(async (hash) => ({
          [hash]: {
            get: permissions.includes(TokenPermission.ReadCache)
              ? await this.storage.createGetSignedUrl(hash)
              : null,
            put: permissions.includes(TokenPermission.WriteCache)
              ? await this.storage.createPutSignedUrl(hash)
              : null,
          },
        }))
      ).pipe(reduce((acc, curr) => ({ ...acc, ...curr }), {}))
    );

    return { urls };
  }

  @Post('end')
  async end(@Body() body: Buffer, @WorkspaceId() workspaceId: string) {
    try {
      const data = JSON.parse(body.toString()) as {
        tasks: Task[];
        run: RunGroup & { command: string };
        machineInfo: {
          machineId: string;
          platform: string;
          version: string;
          cpuCores: number;
        };
      };

      const workspace = await this.workspaceService.getWorkspace(workspaceId);

      let runGroup = await this.runGroupService.findOne(data.run.runGroup);

      if (!runGroup) {
        runGroup = await this.runGroupService.createRunGroup({
          runGroup: data.run.runGroup,
          branch: data.run.branch,
          workspace,
          isCompleted: true,
        });

        await this.executionService.createExecution({
          runGroup,
          command: data.run.command,
          maxParallel: 0,
          tasks: data.tasks.map((task) => ({
            ...task,
            isCompleted: true,
          })),
          isCompleted: true,
        });
      }
    } catch (e) {
      console.error('Error parsing run data', e);
    }

    return {
      // todo: return something meaningful
      runUrl: 'http://localhost:3333/runs/1',
      status: 'success',
    };
  }
}
