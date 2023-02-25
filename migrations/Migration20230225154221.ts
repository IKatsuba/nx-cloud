import { Migration } from '@mikro-orm/migrations';

export class Migration20230225154221 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "task_entity" alter column "is_completed" type boolean using ("is_completed"::boolean);'
    );
    this.addSql(
      'alter table "task_entity" alter column "is_completed" set default false;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "task_entity" alter column "is_completed" drop default;'
    );
    this.addSql(
      'alter table "task_entity" alter column "is_completed" type boolean using ("is_completed"::boolean);'
    );
  }
}
