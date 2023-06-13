import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@nx-turbo/api-auth';

@UseGuards(JwtAuthGuard)
@Controller('save-metrics')
export class ApiSaveMetricsController {
  @Post()
  saveMetrics(
    @Body()
    body: {
      entries: {
        durationMs: number;
        success: boolean;
        statusCode: number;
        entryType: string;
        payloadSize: number;
      }[];
    }
  ) {
    console.log('save-metrics', body);
  }
}
