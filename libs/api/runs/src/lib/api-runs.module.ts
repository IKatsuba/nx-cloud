import { Module } from '@nestjs/common';
import { RunsController } from './runs.controller';
import { S3Service } from './s3.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [RunsController],
  providers: [S3Service],
  imports: [HttpModule],
})
export class ApiRunsModule {}
