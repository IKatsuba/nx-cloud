import { Module } from '@nestjs/common';
import { ApiHttpExecutionsController } from './api-http-executions.controller';
import {
  ExecutionModule,
  RunGroupModule,
  TaskModule,
  WorkspaceModule,
} from '@nx-cloud/api/db/entities';

@Module({
  controllers: [ApiHttpExecutionsController],
  imports: [WorkspaceModule, TaskModule, RunGroupModule, ExecutionModule],
})
export class ApiHttpExecutionsModule {}
