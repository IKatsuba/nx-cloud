-- DropForeignKey
ALTER TABLE "execution_entity" DROP CONSTRAINT "execution_entity_run_group_run_group_foreign";

-- DropForeignKey
ALTER TABLE "run_group_entity" DROP CONSTRAINT "run_group_entity_workspace_id_foreign";

-- DropForeignKey
ALTER TABLE "task_entity" DROP CONSTRAINT "task_entity_execution_id_foreign";

-- AddForeignKey
ALTER TABLE "execution_entity" ADD CONSTRAINT "execution_entity_run_group_run_group_foreign" FOREIGN KEY ("run_group_run_group") REFERENCES "run_group_entity"("run_group") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_group_entity" ADD CONSTRAINT "run_group_entity_workspace_id_foreign" FOREIGN KEY ("workspace_id") REFERENCES "workspace_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_entity" ADD CONSTRAINT "task_entity_execution_id_foreign" FOREIGN KEY ("execution_id") REFERENCES "execution_entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
