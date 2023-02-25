import {
  Collection,
  Entity,
  LoadStrategy,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { RunGroup } from '@nx-cloud/api/models';
import { v4 } from 'uuid';
import { WorkspaceEntity } from '../workspace/workspace.entity';
import { ExecutionEntity } from '../execution/execution.entity';

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

  @Property()
  isCompleted: boolean = false;

  @OneToMany({
    entity: () => ExecutionEntity,
    mappedBy: (execution) => execution.runGroup,
    strategy: LoadStrategy.JOINED,
  })
  executions = new Collection<ExecutionEntity>(this);
}
