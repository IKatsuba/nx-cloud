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

@Injectable()
export class S3Service {
  private client = new S3Client({
    endpoint: process.env.AWS_S3_ENDPOINT_URL,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  constructor(private httpService: HttpService) {}

  async createGetAndPutSignedUrl(
    hash: string
  ): Promise<{ [key: string]: { get: string; put: string } }> {
    const signedUrlForGet = (await this.hasObject(hash))
      ? await getSignedUrl(
          this.client,
          new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: hash,
          }),
          {
            expiresIn: 18000,
          }
        )
      : null;

    const putCommand = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: hash,
    });

    const signedUrlForPut = await getSignedUrl(this.client, putCommand, {
      expiresIn: 18000,
    });

    return {
      [hash]: {
        get: signedUrlForGet,
        put: signedUrlForPut,
      },
    };
  }

  async hasObject(hash?: string): Promise<boolean> {
    if (!hash) {
      return false;
    }

    const command = new HeadObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
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
