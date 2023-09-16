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
import { WorkspaceEntity } from '../workspace/workspace.entity';
import { ExecutionEntity } from '../execution/execution.entity';
import { RunGroup } from '@nx-turbo/api-models';

@Entity()
export class RunGroupEntity implements RunGroup {
  @PrimaryKey()
  runGroup: string = v4();

  @Property({ nullable: true })
  branch: string;

  @ManyToOne({
    entity: () => WorkspaceEntity,
    inversedBy: (workspace) => workspace.runGroups,
    strategy: LoadStrategy.JOINED,
  })
  workspace: WorkspaceEntity;

  @Property({ type: 'boolean' })
  isCompleted = false;

  @OneToMany({
    entity: () => ExecutionEntity,
    mappedBy: (execution) => execution.runGroup,
    strategy: LoadStrategy.JOINED,
  })
  executions = new Collection<ExecutionEntity>(this);
}
