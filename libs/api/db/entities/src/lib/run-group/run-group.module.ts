import { Module } from '@nestjs/common';
import { RunGroupService } from './run-group.service';

@Module({
  providers: [RunGroupService],
  exports: [RunGroupService],
})
export class RunGroupModule {}
