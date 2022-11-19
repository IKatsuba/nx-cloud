import { MikroORM } from '@mikro-orm/core';
import { environment } from '../apps/api/src/environments/environment';

(async () => {
  const orm = await MikroORM.init(environment.mikroOrm);

  const migrator = orm.getMigrator();
  await migrator.createMigration();
  await migrator.up();

  await orm.close(true);
})();
