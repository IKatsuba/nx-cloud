import { Body, Controller, Post } from '@nestjs/common';
import { S3Service } from './s3.service';
import { lastValueFrom, merge, reduce } from 'rxjs';

@Controller('runs')
export class RunsController {
  constructor(private s3: S3Service) {}

  @Post('start')
  async start(@Body('hashes') hashes: string[]) {
    const urls = await lastValueFrom(
      merge(
        ...hashes.map((hash) => this.s3.createGetAndPutSignedUrl(hash))
      ).pipe(reduce((acc, curr) => ({ ...acc, ...curr }), {}))
    );

    return { urls };
  }

  @Post('end')
  end(@Body() body: unknown) {
    console.log('runs/end', body);

    return {
      // todo: return something meaningful
      runUrl: 'http://localhost:3333/runs/1',
      status: 'error',
    };
  }
}
