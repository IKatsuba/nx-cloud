import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { WorkspaceEntity } from '@nx-turbo/api-db-entities';
import { Environment } from '@nx-turbo/api-models';

@Module({
  imports: [
    MikroOrmModule.forFeature([WorkspaceEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService<Environment>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1y' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy],
})
export class ApiAuthModule {}
