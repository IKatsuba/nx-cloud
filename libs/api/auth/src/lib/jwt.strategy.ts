import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPermission } from './token-permissions.decorator';
import { ConfigService } from '@nestjs/config';
import { Environment } from '@nx-turbo/api-models';
import { prisma } from '@nx-turbo/api-db-entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService<Environment>) {
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
    console.log(payload);

    const workspace = await prisma.workspace.findUnique({
      where: {
        id: payload.workspaceId,
      },
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
