import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { WorkspaceEntity } from '@nx-cloud/api/db/entities';
import { EntityRepository } from '@mikro-orm/postgresql';

describe('JwtStrategy', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test';

    moduleRef = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: createMock<EntityRepository<WorkspaceEntity>>(),
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    expect(moduleRef.get(JwtStrategy)).toBeDefined();
  });

  it('should validate', async () => {
    const jwtStrategy = moduleRef.get(JwtStrategy);
    const workspaceRepository = moduleRef.get(
      getRepositoryToken(WorkspaceEntity)
    );
    workspaceRepository.findOne.mockReturnValueOnce(Promise.resolve({}));

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
    const workspaceRepository = moduleRef.get(
      getRepositoryToken(WorkspaceEntity)
    );
    workspaceRepository.findOne.mockReturnValueOnce(Promise.resolve(null));

    const result = await jwtStrategy.validate({
      workspaceId: 'test',
      permissions: [],
    });

    expect(result).toBeNull();
  });
});
