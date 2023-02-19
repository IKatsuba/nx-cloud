import { Migration } from '@mikro-orm/migrations';

export class Migration20221120103818 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "execution_entity" add column "workspace_id" varchar(255) not null;'
    );
    this.addSql(
      'alter table "execution_entity" add constraint "execution_entity_workspace_id_foreign" foreign key ("workspace_id") references "workspace_entity" ("id") on update cascade;'
    );

    this.addSql(
      'alter table "task_entity" add column "execution_id" varchar(255) not null;'
    );
    this.addSql(
      'alter table "task_entity" add constraint "task_entity_execution_id_foreign" foreign key ("execution_id") references "execution_entity" ("id") on update cascade;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "execution_entity" drop constraint "execution_entity_workspace_id_foreign";'
    );

    this.addSql(
      'alter table "task_entity" drop constraint "task_entity_execution_id_foreign";'
    );

    this.addSql('alter table "execution_entity" drop column "workspace_id";');

    this.addSql('alter table "task_entity" drop column "execution_id";');
  }
}
