import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { WorkspaceEntity } from '@nx-cloud/api/db/entities';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@nx-cloud/api/models';

describe('JwtStrategy', () => {
  let moduleRef: TestingModule;
  let configService: DeepMocked<ConfigService<Environment>>;
  let workspaceRepository: DeepMocked<EntityRepository<WorkspaceEntity>>;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: createMock<EntityRepository<WorkspaceEntity>>(),
        },
        {
          provide: ConfigService,
          useValue: createMock<ConfigService>(),
        },
      ],
    }).compile();

    configService = moduleRef.get(ConfigService);
    configService.get.mockReturnValue('test');

    workspaceRepository = moduleRef.get(getRepositoryToken(WorkspaceEntity));
  });

  it('should be defined', () => {
    expect(moduleRef.get(JwtStrategy)).toBeDefined();
  });

  it('should validate', async () => {
    const jwtStrategy = moduleRef.get(JwtStrategy);
    workspaceRepository.findOne.mockReturnValueOnce(Promise.resolve({} as any));

    const result = await jwtStrategy.validate({
      workspaceId: 'test',
      permissions: [],
    });

    expect(result).toEqual({
      workspaceId: 'test',
      permissions: [],
    });
  });

  it('should not validate', async () => {
    const jwtStrategy = moduleRef.get(JwtStrategy);
    workspaceRepository.findOne.mockReturnValueOnce(Promise.resolve(null));

    const result = await jwtStrategy.validate({
      workspaceId: 'test',
      permissions: [],
    });

    expect(result).toBeNull();
  });
});
