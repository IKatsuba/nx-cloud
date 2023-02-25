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

  @ManyToOne({
    entity: () => ExecutionEntity,
    inversedBy: (execution) => execution.tasks,
    strategy: LoadStrategy.JOINED,
  })
  execution: ExecutionEntity;
}
