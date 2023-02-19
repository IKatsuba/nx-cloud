import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WorkspaceService } from './workspace.service';
import { WorkspaceEntity } from './workspace.entity';

@Module({
  imports: [MikroOrmModule.forFeature([WorkspaceEntity])],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
