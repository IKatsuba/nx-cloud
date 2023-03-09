import { Test, TestingModule } from '@nestjs/testing';
import { RunsController } from './runs.controller';
import { Storage } from '@nx-cloud/api/storage';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { TokenPermission } from '@nx-cloud/api/auth';
import {
  ExecutionService,
  RunGroupService,
  WorkspaceService,
} from '@nx-cloud/api/db/entities';

describe('RunsController', () => {
  let controller: RunsController;
  let storage: DeepMocked<Storage>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunsController],
      providers: [
        {
          provide: Storage,
          useValue: createMock<Storage>(),
        },
        {
          provide: RunGroupService,
          useValue: createMock<RunGroupService>(),
        },
        {
          provide: WorkspaceService,
          useValue: createMock<WorkspaceService>(),
        },
        {
          provide: ExecutionService,
          useValue: createMock<ExecutionService>(),
        },
      ],
    }).compile();

    controller = module.get<RunsController>(RunsController);
    storage = module.get(Storage);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return null urls if it has no permissions', async () => {
    expect.assertions(1);

    expect(await controller.start(['hash1', 'hash2'], [])).toEqual({
      urls: {
        hash1: {
          get: null,
          put: null,
        },
        hash2: {
          get: null,
          put: null,
        },
      },
    });
  });

  it('should return urls if it has permissions', async () => {
    expect.assertions(1);

    storage.createGetSignedUrl.mockResolvedValue('get-url');
    storage.createPutSignedUrl.mockResolvedValue('put-url');

    expect(
      await controller.start(
        ['hash1', 'hash2'],
        [TokenPermission.ReadCache, TokenPermission.WriteCache]
      )
    ).toEqual({
      urls: {
        hash1: {
          get: 'get-url',
          put: 'put-url',
        },
        hash2: {
          get: 'get-url',
          put: 'put-url',
        },
      },
    });
  });

  it('should return get urls if it has read permissions', async () => {
    expect.assertions(1);

    storage.createGetSignedUrl.mockResolvedValue('get-url');

    expect(
      await controller.start(['hash1', 'hash2'], [TokenPermission.ReadCache])
    ).toEqual({
      urls: {
        hash1: {
          get: 'get-url',
          put: null,
        },
        hash2: {
          get: 'get-url',
          put: null,
        },
      },
    });
  });

  it('should return put urls if it has write permissions', async () => {
    expect.assertions(1);

    storage.createPutSignedUrl.mockResolvedValue('put-url');

    expect(
      await controller.start(['hash1', 'hash2'], [TokenPermission.WriteCache])
    ).toEqual({
      urls: {
        hash1: {
          get: null,
          put: 'put-url',
        },
        hash2: {
          get: null,
          put: 'put-url',
        },
      },
    });
  });
});
