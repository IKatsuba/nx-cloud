import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Workspace {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;
}
