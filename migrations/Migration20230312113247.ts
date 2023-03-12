import { Migration } from '@mikro-orm/migrations';

export class Migration20230312113247 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "workspace_entity" ("id" varchar(255) not null, "name" varchar(255) not null, "distributed_builds_enabled" boolean not null default true, constraint "workspace_entity_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "run_group_entity" ("run_group" varchar(255) not null, "branch" varchar(255) null, "workspace_id" varchar(255) not null, "is_completed" boolean not null default false, constraint "run_group_entity_pkey" primary key ("run_group"));'
    );

    this.addSql(
      'create table "execution_entity" ("id" varchar(255) not null, "command" varchar(255) not null, "max_parallel" int not null default 3, "status_code" int not null default 0, "is_completed" boolean not null default false, "run_group_run_group" varchar(255) not null, constraint "execution_entity_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "task_entity" ("id" varchar(255) not null, "task_id" varchar(255) not null, "project_name" varchar(255) not null, "target" varchar(255) not null, "params" varchar(255) not null, "configuration" varchar(255) null, "hash" varchar(255) not null, "is_completed" boolean not null default false, "start_time" varchar(255) null, "end_time" varchar(255) null, "cache_status" varchar(255) not null default \'cache-miss\', "created_at" varchar(255) not null, "updated_at" varchar(255) not null, "execution_id" varchar(255) not null, constraint "task_entity_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "run_group_entity" add constraint "run_group_entity_workspace_id_foreign" foreign key ("workspace_id") references "workspace_entity" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "execution_entity" add constraint "execution_entity_run_group_run_group_foreign" foreign key ("run_group_run_group") references "run_group_entity" ("run_group") on update cascade;'
    );

    this.addSql(
      'alter table "task_entity" add constraint "task_entity_execution_id_foreign" foreign key ("execution_id") references "execution_entity" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "run_group_entity" drop constraint "run_group_entity_workspace_id_foreign";'
    );

    this.addSql(
      'alter table "execution_entity" drop constraint "execution_entity_run_group_run_group_foreign";'
    );

    this.addSql(
      'alter table "task_entity" drop constraint "task_entity_execution_id_foreign";'
    );

    this.addSql('drop table if exists "workspace_entity" cascade;');

    this.addSql('drop table if exists "run_group_entity" cascade;');

    this.addSql('drop table if exists "execution_entity" cascade;');

    this.addSql('drop table if exists "task_entity" cascade;');
  }
}
