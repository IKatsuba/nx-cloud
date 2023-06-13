import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@nx-turbo/api-auth';

@UseGuards(JwtAuthGuard)
@Controller('report-client-error')
export class ApiReportClientErrorController {
  @Post()
  reportClientError(@Body() body: unknown) {
    console.error('report-client-error', body);

    return {
      message: 'ok',
    };
  }
}
