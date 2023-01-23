import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ExecutionEntity } from './execution.entity';
import { ExecutionService } from './execution.service';

@Module({
  imports: [MikroOrmModule.forFeature([ExecutionEntity])],
  providers: [ExecutionService],
  exports: [ExecutionService],
})
export class ExecutionModule {}
