import { Body, Controller, Post } from '@nestjs/common';

@Controller('save-metrics')
export class ApiSaveMetricsController {
  @Post()
  saveMetrics(@Body() body: unknown) {
    console.log('save-metrics', body);
  }
}
