import { Global, Module } from '@nestjs/common';
import { Stats } from './stats';
import { PrometheusStats } from './prometheus-stats';
import {
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

@Global()
@Module({
  imports: [PrometheusModule.register()],
  providers: [
    {
      provide: Stats,
      useClass: PrometheusStats,
    },
    makeHistogramProvider({
      name: 'nx_cloud_task_execution_time',
      help: 'Time it takes to execute a task',
      labelNames: ['workspaceName', 'project', 'taskId', 'target'],
      buckets: [],
    }),
    makeHistogramProvider({
      name: 'nx_cloud_task_saved_time',
      help: 'Time it takes to save a task',
      labelNames: ['workspaceName', 'project', 'taskId', 'target'],
      buckets: [],
    }),
  ],
  exports: [Stats],
})
export class PrometheusStatsModule {}
