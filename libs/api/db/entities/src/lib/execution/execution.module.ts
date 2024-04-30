import { Module } from '@nestjs/common';
import { ExecutionService } from './execution.service';

@Module({
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
