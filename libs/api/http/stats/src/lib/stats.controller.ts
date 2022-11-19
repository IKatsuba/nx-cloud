import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@nx-cloud/api/auth';

@UseGuards(JwtAuthGuard)
@Controller('stats')
export class StatsController {
  @Get()
  stats(
    @Body()
    body: {
      command: string;
      isCI: boolean;
      useCloud: boolean;
      meta: string;
    }
  ) {
    console.log('stats', body);

    return;
  }
}
