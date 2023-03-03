import { InjectRepository } from '@mikro-orm/nestjs';
import { WorkspaceEntity } from './workspace.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: EntityRepository<WorkspaceEntity>
  ) {}

  async getWorkspace(workspaceId: string): Promise<WorkspaceEntity> {
    return this.workspaceRepository.findOne(workspaceId);
  }

  isEnabled(workspaceId: string): Promise<boolean> {
    return this.getWorkspace(workspaceId).then(
      (workspace) => workspace.distributedBuildsEnabled
    );
  }

  async assertEnabled(workspaceId: string): Promise<void> {
    if (!(await this.isEnabled(workspaceId))) {
      throw new Error('Workspace is not enabled');
    }
  }
}
