import { Migration } from '@mikro-orm/migrations';

export class Migration20221120122413 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "execution_entity" alter column "max_parallel" type int using ("max_parallel"::int);'
    );
    this.addSql(
      'alter table "execution_entity" alter column "max_parallel" set default 3;'
    );
    this.addSql(
      'alter table "execution_entity" alter column "status_code" type int using ("status_code"::int);'
    );
    this.addSql(
      'alter table "execution_entity" alter column "status_code" set default 0;'
    );
    this.addSql(
      'alter table "execution_entity" alter column "is_complete" type boolean using ("is_complete"::boolean);'
    );
    this.addSql(
      'alter table "execution_entity" alter column "is_complete" set default false;'
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "execution_entity" alter column "max_parallel" drop default;'
    );
    this.addSql(
      'alter table "execution_entity" alter column "max_parallel" type int using ("max_parallel"::int);'
    );
    this.addSql(
      'alter table "execution_entity" alter column "status_code" drop default;'
    );
    this.addSql(
      'alter table "execution_entity" alter column "status_code" type int using ("status_code"::int);'
    );
    this.addSql(
      'alter table "execution_entity" alter column "is_complete" drop default;'
    );
    this.addSql(
      'alter table "execution_entity" alter column "is_complete" type boolean using ("is_complete"::boolean);'
    );
  }
}
