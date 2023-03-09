import { Migration } from '@mikro-orm/migrations';

export class Migration20230309152158 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "task_entity" add column "start_time" varchar(255) null, add column "end_time" varchar(255) null, add column "cache_status" varchar(255) not null default \'cache-miss\';'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "task_entity" drop column "start_time";');
    this.addSql('alter table "task_entity" drop column "end_time";');
    this.addSql('alter table "task_entity" drop column "cache_status";');
  }
}
