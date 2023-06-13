import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TokenPermission } from './token-permissions.decorator';
import { ConfigService } from '@nestjs/config';
import { WorkspaceEntity } from '@nx-turbo/api-db-entities';
import { Environment } from '@nx-turbo/api-models';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: EntityRepository<WorkspaceEntity>,
    configService: ConfigService<Environment>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    workspaceId: string;
    permissions: Array<TokenPermission>;
  }) {
    const workspace = await this.workspaceRepository.findOne({
      id: payload.workspaceId,
    });

    if (!workspace) {
      return null;
    }

    return {
      workspaceId: payload.workspaceId,
      permissions: payload.permissions,
    };
  }
}
