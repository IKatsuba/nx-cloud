import { Injectable } from '@nestjs/common';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable()
export class S3Service {
  client: S3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_S3_ENDPOINT_URL,
  });

  createGetAndPutSignedUrl(hash: string): { get: string; put: string } {
    const getSignedUrl = this.client.getSignedUrl('getObject', {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: hash,
      Expires: 60 * 60,
    });
    const putSignedUrl = this.client.getSignedUrl('putObject', {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: hash,
      Expires: 60 * 60,
    });
    return {
      get: getSignedUrl,
      put: putSignedUrl,
    };
  }
}
