-- CreateTable
CREATE TABLE "execution_entity" (
    "id" VARCHAR(255) NOT NULL,
    "command" VARCHAR(255) NOT NULL,
    "max_parallel" INTEGER NOT NULL DEFAULT 3,
    "status_code" INTEGER NOT NULL DEFAULT 0,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "run_group_run_group" VARCHAR(255) NOT NULL,

    CONSTRAINT "execution_entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mikro_orm_migrations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "executed_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mikro_orm_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "run_group_entity" (
    "run_group" VARCHAR(255) NOT NULL,
    "branch" VARCHAR(255),
    "workspace_id" VARCHAR(255) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "run_group_entity_pkey" PRIMARY KEY ("run_group")
);

-- CreateTable
CREATE TABLE "task_entity" (
    "id" VARCHAR(255) NOT NULL,
    "task_id" VARCHAR(255) NOT NULL,
    "project_name" VARCHAR(255) NOT NULL,
    "target" VARCHAR(255) NOT NULL,
    "params" VARCHAR(255) NOT NULL,
    "configuration" VARCHAR(255),
    "hash" VARCHAR(255) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "start_time" VARCHAR(255),
    "end_time" VARCHAR(255),
    "cache_status" VARCHAR(255) NOT NULL DEFAULT 'cache-miss',
    "created_at" VARCHAR(255) NOT NULL,
    "updated_at" VARCHAR(255) NOT NULL,
    "execution_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "task_entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_entity" (
    "id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "distributed_builds_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "workspace_entity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "execution_entity" ADD CONSTRAINT "execution_entity_run_group_run_group_foreign" FOREIGN KEY ("run_group_run_group") REFERENCES "run_group_entity"("run_group") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_group_entity" ADD CONSTRAINT "run_group_entity_workspace_id_foreign" FOREIGN KEY ("workspace_id") REFERENCES "workspace_entity"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_entity" ADD CONSTRAINT "task_entity_execution_id_foreign" FOREIGN KEY ("execution_id") REFERENCES "execution_entity"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

