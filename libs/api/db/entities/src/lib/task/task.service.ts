import { Injectable } from '@nestjs/common';
import { TaskEntity } from './task.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: EntityRepository<TaskEntity>
  ) {}

  async markCompleted(
    executionId: string,
    completedTaskIds: string[]
  ): Promise<void> {
    await this.taskRepository.nativeUpdate(
      { execution: { id: executionId }, taskId: { $in: completedTaskIds } },
      { isCompleted: true }
    );
  }

  async findIncomplete(id: string): Promise<TaskEntity[]> {
    return this.taskRepository.find({
      execution: { id },
      isCompleted: false,
    });
  }

  async findTaskWithoutCache(hash: string) {
    return this.taskRepository.findOne({
      hash,
      cacheStatus: 'cache-miss',
    });
  }
}
