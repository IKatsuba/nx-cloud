import { Migration } from '@mikro-orm/migrations';

export class Migration20221120060052 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "workspace_entity" ("id" serial primary key, "name" varchar(255) not null, "distributed_builds_enabled" boolean not null default true);'
    );

    this.addSql('drop table if exists "workspace" cascade;');
  }

  async down(): Promise<void> {
    this.addSql(
      'create table "workspace" ("id" serial primary key, "name" varchar(255) not null, "distributed_builds_enabled" boolean not null default true);'
    );

    this.addSql('drop table if exists "workspace_entity" cascade;');
  }
}
