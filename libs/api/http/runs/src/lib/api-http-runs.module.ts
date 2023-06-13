import { DynamicModule, ForwardReference, Module } from '@nestjs/common';
import { RunsController } from './runs.controller';
import { HttpModule } from '@nestjs/axios';
import { Type } from '@nestjs/common/interfaces/type.interface';
import {
  ExecutionModule,
  RunGroupModule,
  TaskModule,
  WorkspaceModule,
} from '@nx-turbo/api-db-entities';

@Module({
  controllers: [RunsController],
  imports: [
    HttpModule,
    RunGroupModule,
    WorkspaceModule,
    ExecutionModule,
    TaskModule,
  ],
})
export class ApiHttpRunsModule {
  static forRoot({
    imports,
  }: {
    imports?: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >;
  }): DynamicModule {
    return {
      module: ApiHttpRunsModule,
      imports: imports ?? [],
    };
  }
}
