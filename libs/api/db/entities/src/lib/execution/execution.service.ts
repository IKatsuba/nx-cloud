import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma';
import { Execution, RunGroup, Task } from '@prisma/client';

@Injectable()
export class ExecutionService {
  async createExecution(param: {
    runGroup: RunGroup;
    command: string;
    tasks: Task[];
    maxParallel: number;
    isCompleted?: boolean;
  }) {
    return prisma.execution.create({
      data: {
        runGroup: { connect: { runGroup: param.runGroup.runGroup } },
        command: param.command,
        tasks: {
          create: (param.tasks || []).map((task) => ({
            taskId: task.taskId,
            projectName: task.projectName,
            target: task.target,
            params: task.params,
            configuration: task.configuration,
            hash: task.hash,
            isCompleted: false,
            startTime: task.startTime,
            endTime: task.endTime,
            cacheStatus: task.cacheStatus,
          })),
        },
        maxParallel: param.maxParallel,
        isCompleted: param.isCompleted ?? false,
      },
      include: {
        tasks: true,
        runGroup: true,
      },
    });
  }

  async findOne(id: string) {
    return prisma.execution.findUnique({
      where: { id },
      include: { tasks: true, runGroup: true },
    });
  }

  async completeExecution(execution: Execution): Promise<void> {
    execution.isCompleted = true;

    await prisma.execution.update({
      where: { id: execution.id },
      data: { isCompleted: true },
    });
  }

  async findFirstIncomplete(runGroup: string) {
    return prisma.execution.findFirst({
      where: {
        runGroup: { runGroup },
        isCompleted: false,
      },
    });
  }

  async setStatusCode(id: string, statusCode: number): Promise<void> {
    await prisma.execution.update({
      where: { id },
      data: { statusCode },
    });
  }
}
