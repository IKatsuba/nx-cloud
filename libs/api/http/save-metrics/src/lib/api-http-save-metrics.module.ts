import { Module } from '@nestjs/common';
import { ApiSaveMetricsController } from './api-save-metrics.controller';

@Module({
  controllers: [ApiSaveMetricsController],
})
export class ApiHttpSaveMetricsModule {}
