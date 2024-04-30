import { Injectable } from '@nestjs/common';
import { prisma } from '../prisma';

@Injectable()
export class WorkspaceService {
  async getWorkspace(workspaceId: string) {
    return prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
    });
  }

  async isEnabled(workspaceId: string): Promise<boolean> {
    const workspace = await this.getWorkspace(workspaceId);

    return workspace.distributedBuildsEnabled;
  }
}
