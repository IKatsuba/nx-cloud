import { Body, Controller, Post } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('runs')
export class RunsController {
  constructor(private s3: S3Service) {}

  @Post('start')
  start(@Body('hashes') hashes: string[]) {
    return {
      urls: hashes
        .map((hash) => ({
          [hash]: this.s3.createGetAndPutSignedUrl(hash),
        }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    };
  }

  @Post('end')
  end(@Body() body: unknown) {
    console.log('runs/end', body);

    return {
      runUrl: 'http://localhost:3333/runs/1',
      status: 'error',
    };
  }
}
