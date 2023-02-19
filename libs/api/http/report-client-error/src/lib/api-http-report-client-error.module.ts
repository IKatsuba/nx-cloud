import { Module } from '@nestjs/common';
import { ApiReportClientErrorController } from './api-report-client-error.controller';

@Module({
  controllers: [ApiReportClientErrorController],
})
export class ApiHttpReportClientErrorModule {}
