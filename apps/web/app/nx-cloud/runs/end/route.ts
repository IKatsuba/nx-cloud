import { PrismaClient, RunGroupEntity, TaskEntity } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as process from 'node:process';

export async function POST(request: Request) {
  const data = (await request.json()) as {
    meta: {
      nxCloudVersion: string;
    };
    tasks: TaskEntity[];
    run: RunGroupEntity & { command: string };
    machineInfo: {
      machineId: string;
      platform: string;
      version: string;
      cpuCores: number;
    };
  };

  const { workspaceId } = jwt.verify(
    request.headers.get('Authorization')!,
    process.env.JWT_SECRET!
  ) as { workspaceId: string };

  const prisma = new PrismaClient();

  const workspace = await prisma.workspaceEntity.findUnique({
    where: { id: workspaceId },
  });

  for (const task of data.tasks) {
    const prevTask =
      task.cacheStatus === 'cache-miss'
        ? task
        : (await prisma.taskEntity.findFirst({
            where: {
              execution: {
                runGroup: {
                  workspace: {
                    id: workspaceId,
                  },
                },
              },
              hash: task.hash,
              cacheStatus: 'cache-miss',
            },
            orderBy: { startTime: 'desc' },
          })) ?? task;

    const executionTime =
      Date.parse(task.endTime ?? new Date().toISOString()) -
      Date.parse(task.startTime ?? new Date().toISOString());

    const prevExecutionTime =
      Date.parse(prevTask.endTime ?? new Date().toISOString()) -
      Date.parse(prevTask.startTime ?? new Date().toISOString());

    const diff = prevExecutionTime - executionTime;

    // await this.stats?.trackTaskExecutionTime?.(
    //   workspace,
    //   task,
    //   executionTime,
    //   diff
    // );
  }

  const runGroup =
    (await prisma.runGroupEntity.findUnique({
      where: { runGroup: data.run.runGroup },
    })) ??
    (await prisma.runGroupEntity.create({
      data: {
        runGroup: data.run.runGroup,
        branch: data.run.branch,
        workspace: {
          connect: { id: workspaceId },
        },
        isCompleted: true,
      },
    }));

  await prisma.executionEntity.create({
    data: {
      runGroup: {
        connect: { runGroup: runGroup.runGroup },
      },
      command: data.run.command,
      maxParallel: 0,
      tasks: {
        create: data.tasks.map((task) => ({
          ...task,
          isCompleted: true,
        })),
      },
      isCompleted: true,
    },
  });

  return {
    // todo: return something meaningful
    runUrl: 'http://localhost:3333/runs/1',
    status: 'success',
  };
}
