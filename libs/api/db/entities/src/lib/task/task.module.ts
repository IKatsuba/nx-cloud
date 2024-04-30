import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
