import { Execution } from '@nx-cloud/api/models';
import { RunGroupEntity, TaskEntity } from '@nx-cloud/api/db/entities';
import {
  Collection,
  Entity,
  LoadStrategy,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class ExecutionEntity implements Omit<Execution, 'tasks'> {
  @PrimaryKey()
  id: string = v4();

  @Property()
  command: string;

  @Property()
  maxParallel: number = 3;

  @Property()
  statusCode: number = 0;

  @Property()
  isCompleted: boolean = false;

  @ManyToOne({
    entity: () => RunGroupEntity,
    inversedBy: (runGroup) => runGroup.executions,
    strategy: LoadStrategy.JOINED,
  })
  runGroup: RunGroupEntity;

  @OneToMany({
    entity: () => TaskEntity,
    mappedBy: (task) => task.execution,
    strategy: LoadStrategy.JOINED,
  })
  tasks = new Collection<TaskEntity>(this);
}
