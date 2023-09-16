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
import { Execution } from '@nx-turbo/api-models';
import { RunGroupEntity } from '../run-group/run-group.entity';
import { TaskEntity } from '../task/task.entity';

@Entity()
export class ExecutionEntity implements Omit<Execution, 'tasks'> {
  @PrimaryKey()
  id: string = v4();

  @Property()
  command: string;

  @Property({ type: 'number' })
  maxParallel = 3;

  @Property({ type: 'number' })
  statusCode = 0;

  @Property({ type: 'boolean' })
  isCompleted = false;

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
