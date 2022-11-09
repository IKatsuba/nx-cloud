import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { Storage } from '../storage';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: Storage,
      useClass: S3Service,
    },
  ],
  exports: [Storage],
})
export class S3StorageModule {}
