import { Injectable } from '@nestjs/common';
import { RunGroupEntity } from './run-group.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class RunGroupService {
  constructor(
    @InjectRepository(RunGroupEntity)
    private readonly runGroupRepository: EntityRepository<RunGroupEntity>
  ) {}

  async createRunGroup({
    runGroup,
    branch,
  }: {
    runGroup: string;
    branch: string;
  }) {
    const runGroupEntity = new RunGroupEntity();
    runGroupEntity.runGroup = runGroup;
    runGroupEntity.branch = branch;
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
    runGroupEntity.executions.forEach((execution) => {
      execution.isCompleted = true;
    });
    await this.runGroupRepository.upsert(runGroupEntity);
  }
}
