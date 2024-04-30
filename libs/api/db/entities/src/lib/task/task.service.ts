import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma';

@Injectable()
export class TaskService {
  async markCompleted(
    executionId: string,
    completedTaskIds: string[]
  ): Promise<void> {
    await prisma.task.updateMany({
      where: {
        taskId: {
          in: completedTaskIds,
        },
        execution: {
          id: executionId,
        },
      },
      data: {
        isCompleted: true,
      },
    });
  }

  async findIncomplete(id: string) {
    return prisma.task.findMany({
      where: {
        execution: {
          id,
        },
        isCompleted: false,
      },
    });
  }

  async findTaskWithoutCache(workspaceId: string, hash: string) {
    return prisma.task.findFirst({
      where: {
        execution: {
          runGroup: {
            workspace: {
              id: workspaceId,
            },
          },
        },
        hash,
        cacheStatus: 'cache-miss',
      },
      orderBy: {
        startTime: 'desc',
      },
    });
  }
}
