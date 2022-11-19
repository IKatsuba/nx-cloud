import { StatsController } from './stats.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [StatsController],
})
export class ApiHttpStatsModule {}
