import { Injectable } from '@nestjs/common';
import { ExecutionEntity } from './execution.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { RunGroupEntity } from '../run-group/run-group.entity';
import { TaskEntity } from '../task/task.entity';

@Injectable()
export class ExecutionService {
  constructor(
    @InjectRepository(ExecutionEntity)
    private readonly executionRepository: EntityRepository<ExecutionEntity>,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: EntityRepository<TaskEntity>
  ) {}

  async createExecution(param: {
    runGroup: RunGroupEntity;
    command: string;
    tasks: any;
    maxParallel: number;
  }): Promise<ExecutionEntity> {
    const executionEntity = new ExecutionEntity();
    executionEntity.runGroup = param.runGroup;
    executionEntity.command = param.command;
    executionEntity.tasks = (param.tasks || []).map((task) =>
      this.taskRepository.create(task)
    );
    executionEntity.maxParallel = param.maxParallel;

    await this.executionRepository.persistAndFlush(executionEntity);

    return executionEntity;
  }

  async findOne(id: string) {
    return this.executionRepository
      .createQueryBuilder('execution')
      .where({ id })
      .getSingleResult();
  }

  async completeExecution(execution: ExecutionEntity) {
    execution.isCompleted = true;
    await this.executionRepository.upsert({
      id: execution.id,
      isCompleted: true,
    });
  }

  async findFirstIncomplete(runGroup: string): Promise<ExecutionEntity> {
    return this.executionRepository.findOne({
      runGroup: { runGroup },
      isCompleted: false,
    });
  }

  async setStatusCode(id: string, statusCode: number) {
    await this.executionRepository.nativeUpdate(
      { id },
      { statusCode: statusCode }
    );
  }
}
