import { Body, Controller, Post } from '@nestjs/common';

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
