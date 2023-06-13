import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { RunGroupEntity } from '../run-group/run-group.entity';
import { Workspace } from '@nx-turbo/api-models';

@Entity()
export class WorkspaceEntity implements Workspace {
  @PrimaryKey()
  id: string = v4();

  @Property()
  name: string;

  @Property()
  distributedBuildsEnabled: boolean = true;

  @OneToMany({
    entity: () => RunGroupEntity,
    mappedBy: (runGroup) => runGroup.workspace,
  })
  runGroups = new Collection<RunGroupEntity>(this);
}
