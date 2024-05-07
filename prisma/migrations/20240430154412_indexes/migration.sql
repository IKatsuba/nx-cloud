-- CreateIndex
CREATE INDEX "execution_entity_run_group_run_group_idx" ON "execution_entity"("run_group_run_group");

-- CreateIndex
CREATE INDEX "task_entity_task_id_execution_id_idx" ON "task_entity"("task_id", "execution_id");

-- CreateIndex
CREATE INDEX "task_entity_execution_id_idx" ON "task_entity"("execution_id");

-- CreateIndex
CREATE INDEX "task_entity_hash_idx" ON "task_entity"("hash");
