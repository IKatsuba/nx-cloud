import { Inject, Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { fromEnv, fromTokenFile } from '@aws-sdk/credential-providers';
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
import { InjectPinoLogger, Logger } from 'nestjs-pino';
import { AwsCredentialIdentityProvider } from '@smithy/types';

export const S3_CREDENTIALS = Symbol('S3_CREDENTIALS');

function withLogger(
  logger: Logger,
  provider: AwsCredentialIdentityProvider
): AwsCredentialIdentityProvider {
  return async (...args: unknown[]) => {
    logger.debug('Create s3 credentials');

    return provider(...args).catch((error) => {
      logger.error(
        { error, errorStack: error.toString() },
        'Error creating s3 credentials'
      );
      throw error;
    });
  };
}

export function s3CredentialsFactory(
  config: ConfigService<Environment>,
  logger: Logger
): S3ClientConfig['credentials'] {
  logger.debug('Create s3 credentials');

  if (config.get('AWS_WEB_IDENTITY_TOKEN_FILE') && config.get('AWS_ROLE_ARN')) {
    logger.debug('Create s3 credentials from token file');

    return withLogger(
      logger,
      fromTokenFile({
        clientConfig: {
          region: config.get('AWS_REGION'),
        },
      })
    );
  }

  logger.debug(
    'Create s3 credentials from access key id and secret access key'
  );

  return withLogger(logger, fromEnv());
}

@Injectable()
export class S3Service extends Storage {
  @InjectPinoLogger('S3Service')
  private logger: Logger;

  private client = new S3Client({
    endpoint: this.configService.get('AWS_S3_ENDPOINT_URL'),
    region: this.configService.get('AWS_REGION'),
    credentials: this.credentials,
    forcePathStyle: true,
  });

  constructor(
    private httpService: HttpService,
    private configService: ConfigService<Environment>,
    @Inject(S3_CREDENTIALS) private credentials: S3ClientConfig['credentials']
  ) {
    super();
  }

  async createGetSignedUrl(hash: string): Promise<string | null> {
    this.logger.debug({ hash }, 'Create get signed url');

    const hasObject = await this.hasObject(hash);

    if (!hasObject) {
      return null;
    }

    try {
      this.logger.debug({ hash }, 'Sign get url');

      const signedUrl = await getSignedUrl(
        this.client,
        new GetObjectCommand({
          Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
          Key: hash,
        }),
        {
          expiresIn: 18000,
        }
      );

      this.logger.debug({ hash, signedUrl }, 'Signed get url');

      return signedUrl;
    } catch (error) {
      this.logger.error(
        { hash, error, errorStack: error.toString() },
        'Error creating get signed url'
      );

      return null;
    }
  }

  async createPutSignedUrl(hash: string): Promise<string | null> {
    this.logger.debug({ hash }, 'Create put signed url');

    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: hash,
    });

    try {
      const signedUrl = await getSignedUrl(this.client, command, {
        expiresIn: 18000,
      });

      this.logger.debug({ hash, signedUrl }, 'Signed put url');

      return signedUrl;
    } catch (error) {
      this.logger.error(
        { hash, error, errorStack: error.toString() },
        'Error creating put signed url'
      );

      return null;
    }
  }

  async hasObject(hash?: string): Promise<boolean> {
    if (!hash) {
      return false;
    }

    this.logger.debug({ hash }, 'Check if object exists');

    try {
      const headUrl = await this.getSignedHeadUrl(hash);

      if (!headUrl) {
        return false;
      }

      const response$ = this.httpService.head(headUrl).pipe(
        map((req) => req.status >= 200 && req.status < 400),
        catchError((error) => {
          this.logger.debug(
            { hash, error, errorStack: error.toString() },
            'Error checking if object exists'
          );
          return of(false);
        })
      );

      const hasObject = await lastValueFrom(response$);

      this.logger.debug(
        {
          hash,
          hasObject,
        },
        'Completed check if object exists'
      );

      return hasObject;
    } catch (error) {
      this.logger.error(
        { hash, error, errorStack: error.toString() },
        'Error checking if object exists'
      );

      return false;
    }
  }

  protected async getSignedHeadUrl(hash: string): Promise<string | null> {
    this.logger.debug({ hash }, 'Sign head url');

    const command = new HeadObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: hash,
    });

    try {
      const headUrl = await getSignedUrl(this.client, command, {
        expiresIn: 18000,
      });

      this.logger.debug({ hash, headUrl }, 'Signed head url');

      return headUrl;
    } catch (error) {
      this.logger.error(
        { hash, error, errorStack: error.toString() },
        'Error creating head signed url'
      );

      return null;
    }
  }
}
