import { Migration } from '@mikro-orm/migrations';

export class Migration20221120113845 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "task_entity" add column "is_completed" boolean not null;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "task_entity" drop column "is_completed";');
  }
}
