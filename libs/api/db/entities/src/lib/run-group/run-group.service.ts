import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma';

@Injectable()
export class RunGroupService {
  async createRunGroup({
    runGroup,
    branch,
    workspaceId,
    isCompleted,
  }: {
    runGroup: string;
    branch: string;
    workspaceId: string;
    isCompleted?: boolean;
  }) {
    return prisma.runGroup.create({
      data: {
        runGroup,
        branch,
        isCompleted: isCompleted ?? false,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
      },
    });
  }

  async exists(runGroup: string): Promise<boolean> {
    return !!(await prisma.runGroup.findUnique({
      where: { runGroup },
    }));
  }

  async findOne(runGroup: string) {
    return prisma.runGroup.findUnique({
      where: { runGroup },
      include: { executions: true },
    });
  }

  async completeRunGroup(runGroup: string): Promise<void> {
    await prisma.runGroup.update({
      where: { runGroup },
      data: { isCompleted: true },
    });

    await prisma.execution.updateMany({
      where: { runGroupId: runGroup },
      data: { isCompleted: true },
    });
  }
}
