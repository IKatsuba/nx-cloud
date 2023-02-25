import { Injectable } from '@nestjs/common';
import { RunGroupEntity } from './run-group.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { WorkspaceEntity } from '../workspace/workspace.entity';
import { workspaceGenerators } from 'nx/src/command-line/workspace-generators';

@Injectable()
export class RunGroupService {
  constructor(
    @InjectRepository(RunGroupEntity)
    private readonly runGroupRepository: EntityRepository<RunGroupEntity>
  ) {}

  async createRunGroup({
    runGroup,
    branch,
    workspace,
  }: {
    runGroup: string;
    branch: string;
    workspace: WorkspaceEntity;
  }) {
    const runGroupEntity = new RunGroupEntity();
    runGroupEntity.runGroup = runGroup;
    runGroupEntity.branch = branch;
    runGroupEntity.workspace = workspace;
    await this.runGroupRepository.persistAndFlush(runGroupEntity);
  }

  async exists(runGroup: string) {
    return !!(await this.runGroupRepository
      .createQueryBuilder('runGroup')
      .where({ runGroup })
      .getCount());
  }

  async findOne(runGroup: string): Promise<RunGroupEntity> {
    return this.runGroupRepository.findOne({ runGroup });
  }

  async completeRunGroup(runGroup: string) {
    const runGroupEntity = await this.findOne(runGroup);

    if (!runGroupEntity) {
      return;
    }

    runGroupEntity.isCompleted = true;

    await runGroupEntity.executions.init();

    for (const execution of runGroupEntity.executions) {
      execution.isCompleted = true;
    }

    await this.runGroupRepository.upsert(runGroupEntity);
  }
}
