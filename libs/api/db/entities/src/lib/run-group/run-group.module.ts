import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RunGroupEntity } from './run-group.entity';
import { RunGroupService } from './run-group.service';

@Module({
  imports: [MikroOrmModule.forFeature([RunGroupEntity])],
  providers: [RunGroupService],
  exports: [RunGroupService],
})
export class RunGroupModule {}
