export interface Environment {
  PORT: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_USER: string;
  JWT_SECRET: string;
  AWS_S3_ENDPOINT_URL: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET_NAME: string;

  AWS_ROLE_ARN: string;
  AWS_WEB_IDENTITY_TOKEN_FILE: string;
}
