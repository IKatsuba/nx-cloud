import { Migration } from '@mikro-orm/migrations';

export class Migration20221120120145 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "execution_entity" add column "is_complete" boolean not null;'
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "execution_entity" drop column "is_complete";');
  }
}
