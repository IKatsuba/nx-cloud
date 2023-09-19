import { Module } from '@nestjs/common';
import { S3_CREDENTIALS, s3CredentialsFactory, S3Service } from './s3.service';
import { Storage } from '../storage';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: Storage,
      useClass: S3Service,
    },
    {
      provide: S3_CREDENTIALS,
      useFactory: s3CredentialsFactory,
      inject: [ConfigService],
    },
  ],
  exports: [Storage],
})
export class S3StorageModule {}
