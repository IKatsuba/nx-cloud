import { Module } from '@nestjs/common';
import { RunsController } from './runs.controller';
import { S3Service } from './s3.service';

@Module({
  controllers: [RunsController],
  providers: [S3Service],
})
export class ApiRunsModule {}
