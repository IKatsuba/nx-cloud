import { Migration } from '@mikro-orm/migrations';

export class Migration20221120141924 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "run_group_entity" ("run_group" varchar(255) not null, "branch" varchar(255) null, "workspace_id" varchar(255) not null, "is_completed" boolean not null default false, constraint "run_group_entity_pkey" primary key ("run_group"));'
    );

    this.addSql(
      'alter table "run_group_entity" add constraint "run_group_entity_workspace_id_foreign" foreign key ("workspace_id") references "workspace_entity" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "execution_entity" drop constraint "execution_entity_workspace_id_foreign";'
    );

    this.addSql(
      'alter table "execution_entity" add column "run_group_run_group" varchar(255) not null;'
    );
    this.addSql(
      'alter table "execution_entity" add constraint "execution_entity_run_group_run_group_foreign" foreign key ("run_group_run_group") references "run_group_entity" ("run_group") on update cascade;'
    );
    this.addSql('alter table "execution_entity" drop column "branch";');
    this.addSql('alter table "execution_entity" drop column "run_group";');
    this.addSql('alter table "execution_entity" drop column "workspace_id";');
    this.addSql(
      'alter table "execution_entity" rename column "is_complete" to "is_completed";'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "execution_entity" drop constraint "execution_entity_run_group_run_group_foreign";'
    );

    this.addSql('drop table if exists "run_group_entity" cascade;');

    this.addSql(
      'alter table "execution_entity" add column "branch" varchar(255) null, add column "workspace_id" varchar(255) not null;'
    );
    this.addSql(
      'alter table "execution_entity" add constraint "execution_entity_workspace_id_foreign" foreign key ("workspace_id") references "workspace_entity" ("id") on update cascade;'
    );
    this.addSql(
      'alter table "execution_entity" rename column "run_group_run_group" to "run_group";'
    );
    this.addSql(
      'alter table "execution_entity" rename column "is_completed" to "is_complete";'
    );
  }
}
