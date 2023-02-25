import { Migration } from '@mikro-orm/migrations';

export class Migration20230225154116 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "task_entity" alter column "configuration" type varchar(255) using ("configuration"::varchar(255));'
    );
    this.addSql(
      'alter table "task_entity" alter column "configuration" drop not null;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "task_entity" alter column "configuration" type varchar(255) using ("configuration"::varchar(255));'
    );
    this.addSql(
      'alter table "task_entity" alter column "configuration" set not null;'
    );
  }
}
