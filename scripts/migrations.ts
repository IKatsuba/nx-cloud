import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// check if old database exists
const prisma = new PrismaClient();

async function main() {
  const anyMikroOrmMigration = await prisma.mikro_orm_migrations.findFirst();

  if (anyMikroOrmMigration) {
    console.log('Detect MicroORM migration');
    console.log(`Skip Prisma migration '0_init'`);
    const data =
      ((await prisma.$queryRaw`select * from _prisma_migrations where migration_name = ${'0_init'}`) ??
        []) as any[];

    if (data.length) {
      console.log('Migration 0_init already applied');
    } else {
      execSync('npx prisma migrate resolve --applied 0_init');
    }
  }

  console.log('Run Prisma migration');
  execSync('npx prisma migrate deploy');
}

main();
