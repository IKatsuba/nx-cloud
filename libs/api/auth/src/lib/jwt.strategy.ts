import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Workspace } from '@nx-cloud/api/db/entities';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TokenPermission } from './token-permissions.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Workspace)
    private workspaceRepository: EntityRepository<Workspace>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: {
    workspaceName: string;
    workspaceId: number;
    permissions: Array<TokenPermission>;
  }) {
    const workspace = await this.workspaceRepository.findOne({
      id: payload.workspaceId,
    });

    if (!workspace) {
      return null;
    }

    return {
      workspaceName: payload.workspaceName,
      workspaceId: payload.workspaceId,
      permissions: payload.permissions,
    };
  }
}
