import { Migration } from '@mikro-orm/migrations';

export class Migration20240507084336 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create index "task_entity_hash_index" on "task_entity" ("hash");'
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index "task_entity_hash_index";');
  }
}
