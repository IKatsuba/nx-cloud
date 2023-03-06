import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Storage } from '../storage';
import { Environment } from '@nx-cloud/api/models';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service extends Storage {
  private client = new S3Client({
    endpoint: this.configService.get('AWS_S3_ENDPOINT_URL'),
    region: this.configService.get('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  constructor(
    private httpService: HttpService,
    private configService: ConfigService<Environment>
  ) {
    super();
  }

  async createGetSignedUrl(hash: string): Promise<string> {
    return (await this.hasObject(hash))
      ? await getSignedUrl(
          this.client,
          new GetObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
            Key: hash,
          }),
          {
            expiresIn: 18000,
          }
        )
      : null;
  }

  async createPutSignedUrl(hash: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: hash,
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: 18000,
    });
  }

  async hasObject(hash?: string): Promise<boolean> {
    if (!hash) {
      return false;
    }

    const command = new HeadObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: hash,
    });

    const headUrl = await getSignedUrl(this.client, command, {
      expiresIn: 18000,
    });

    const response$ = this.httpService.head(headUrl).pipe(
      map((req) => req.status >= 200 && req.status < 400),
      catchError((error) => of(false))
    );

    return lastValueFrom(response$);
  }
}
