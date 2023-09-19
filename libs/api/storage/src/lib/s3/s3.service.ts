import { Inject, Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { fromTokenFile } from '@aws-sdk/credential-providers';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { catchError, lastValueFrom, map, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Storage } from '../storage';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@nx-turbo/api-models';

export const S3_CREDENTIALS = Symbol('S3_CREDENTIALS');

export function s3CredentialsFactory(
  config: ConfigService<Environment>
): S3ClientConfig['credentials'] {
  if (config.get('AWS_WEB_IDENTITY_TOKEN_FILE') && config.get('AWS_ROLE_ARN')) {
    return fromTokenFile({
      webIdentityTokenFile: config.get('AWS_WEB_IDENTITY_TOKEN_FILE'),
      roleArn: config.get('AWS_ROLE_ARN'),
    });
  }

  return {
    accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
  };
}

@Injectable()
export class S3Service extends Storage {
  private client = new S3Client({
    endpoint: this.configService.get('AWS_S3_ENDPOINT_URL'),
    region: this.configService.get('AWS_REGION'),
    credentials: this.credentials,
  });

  constructor(
    private httpService: HttpService,
    private configService: ConfigService<Environment>,
    @Inject(S3_CREDENTIALS) private credentials: S3ClientConfig['credentials']
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
