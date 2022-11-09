import { DynamicModule, Module } from '@nestjs/common';
import { RunsController } from './runs.controller';
import { HttpModule } from '@nestjs/axios';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ForwardReference } from '@nestjs/common/interfaces/modules/forward-reference.interface';

@Module({
  controllers: [RunsController],
  imports: [HttpModule],
})
export class ApiRunsModule {
  static forRoot({
    imports,
  }: {
    imports?: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >;
  }): DynamicModule {
    return {
      module: ApiRunsModule,
      imports: imports ?? [],
    };
  }
}
