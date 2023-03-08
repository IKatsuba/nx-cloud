import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { lastValueFrom, merge, reduce } from 'rxjs';
import { Storage } from '@nx-cloud/api/storage';
import {
  JwtAuthGuard,
  TokenPermission,
  TokenPermissions,
} from '@nx-cloud/api/auth';

@UseGuards(JwtAuthGuard)
@Controller('runs')
export class RunsController {
  constructor(private storage: Storage) {}

  @Post('start')
  async start(
    @Body('hashes') hashes: string[],
    @TokenPermissions() permissions: TokenPermission[]
  ) {
    const urls = await lastValueFrom(
      merge(
        ...hashes.map(async (hash) => ({
          [hash]: {
            get: permissions.includes(TokenPermission.ReadCache)
              ? await this.storage.createGetSignedUrl(hash)
              : null,
            put: permissions.includes(TokenPermission.WriteCache)
              ? await this.storage.createPutSignedUrl(hash)
              : null,
          },
        }))
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
      status: 'completed',
    };
  }
}
