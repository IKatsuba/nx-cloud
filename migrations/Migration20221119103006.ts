import { Migration } from '@mikro-orm/migrations';

export class Migration20221119103006 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "workspace" ("id" serial primary key, "name" varchar(255) not null);'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "workspace" cascade;');
  }
}
