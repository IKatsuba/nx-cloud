import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [MikroOrmModule.forFeature([TaskEntity])],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
