import { Body, Controller, Post } from '@nestjs/common';
import { lastValueFrom, merge, reduce } from 'rxjs';
import { Storage } from '@nx-cloud/api/storage';

@Controller('runs')
export class RunsController {
  constructor(private storage: Storage) {}

  @Post('start')
  async start(@Body('hashes') hashes: string[]) {
    const urls = await lastValueFrom(
      merge(
        ...hashes.map((hash) => this.storage.createGetAndPutSignedUrl(hash))
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
