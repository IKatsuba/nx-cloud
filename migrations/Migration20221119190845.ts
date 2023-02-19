import { Migration } from '@mikro-orm/migrations';

export class Migration20221119190845 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "workspace" add column "distributed_builds_enabled" boolean not null default true;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "workspace" drop column "distributed_builds_enabled";'
    );
  }
}
