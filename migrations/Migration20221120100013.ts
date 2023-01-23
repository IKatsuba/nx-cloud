import { Migration } from '@mikro-orm/migrations';

export class Migration20221120100013 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "execution_entity" ("id" varchar(255) not null, "branch" varchar(255) not null, "command" varchar(255) not null, "max_parallel" int not null, "run_group" varchar(255) not null, "status_code" int not null, constraint "execution_entity_pkey" primary key ("id"));'
    );

    this.addSql(
      'create table "task_entity" ("id" varchar(255) not null, "task_id" varchar(255) not null, "project_name" varchar(255) not null, "target" varchar(255) not null, "params" varchar(255) not null, "configuration" varchar(255) not null, "hash" varchar(255) not null, constraint "task_entity_pkey" primary key ("id"));'
    );

    this.addSql(
      'alter table "workspace_entity" alter column "id" type varchar(255) using ("id"::varchar(255));'
    );
    this.addSql(
      'alter table "workspace_entity" alter column "id" drop default;'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "execution_entity" cascade;');

    this.addSql('drop table if exists "task_entity" cascade;');

    this.addSql(
      'alter table "workspace_entity" alter column "id" type int using ("id"::int);'
    );
    this.addSql('create sequence if not exists "workspace_entity_id_seq";');
    this.addSql(
      'select setval(\'workspace_entity_id_seq\', (select max("id") from "workspace_entity"));'
    );
    this.addSql(
      'alter table "workspace_entity" alter column "id" set default nextval(\'workspace_entity_id_seq\');'
    );
  }
}
