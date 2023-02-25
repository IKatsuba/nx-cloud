import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ExecutionEntity } from './execution.entity';
import { ExecutionService } from './execution.service';
import { TaskEntity } from '../task/task.entity';

@Module({
  imports: [MikroOrmModule.forFeature([ExecutionEntity, TaskEntity])],
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
