import {
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Task } from '@nx-cloud/api/models';
import { ExecutionEntity } from '../execution/execution.entity';
import { v4 } from 'uuid';

@Entity()
export class TaskEntity implements Task {
  @PrimaryKey()
  id: string = v4();

  @Property()
  taskId: string;

  @Property()
  projectName: string;

  @Property()
  target: string;

  @Property()
  params: string;

  @Property({ nullable: true })
  configuration: string;

  @Property()
  hash: string;

  @Property()
  isCompleted: boolean = false;

  @Property({ nullable: true })
  startTime: string;

  @Property({ nullable: true })
  endTime: string;

  @Property({ default: 'cache-miss' })
  cacheStatus: 'cache-miss' | 'local-cache-hit' | 'remote-cache-hit' =
    'cache-miss';

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToOne({
    entity: () => ExecutionEntity,
    inversedBy: (execution) => execution.tasks,
    strategy: LoadStrategy.JOINED,
  })
  execution: ExecutionEntity;
}
