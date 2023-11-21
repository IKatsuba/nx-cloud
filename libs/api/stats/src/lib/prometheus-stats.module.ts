import { Global, Module } from '@nestjs/common';
import { Stats } from './stats';
import { PrometheusStats } from './prometheus-stats';
import {
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@nx-turbo/api-models';

@Global()
@Module({
  imports: [
    PrometheusModule.registerAsync({
      useFactory: (config: ConfigService<Environment>) => ({
        path: config.get('METRICS_PATH', '/metrics'),
        defaultMetrics: {
          enabled: config.get('DEFAULT_METRICS_ENABLED', true),
          config: {
            prefix: config.get('DEFAULT_METRICS_PREFIX', 'nx_cloud_'),
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
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
