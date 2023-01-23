import { Migration } from '@mikro-orm/migrations';

export class Migration20221120121713 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "execution_entity" alter column "branch" type varchar(255) using ("branch"::varchar(255));'
    );
    this.addSql(
      'alter table "execution_entity" alter column "branch" drop not null;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "execution_entity" alter column "branch" type varchar(255) using ("branch"::varchar(255));'
    );
    this.addSql(
      'alter table "execution_entity" alter column "branch" set not null;'
    );
  }
}
