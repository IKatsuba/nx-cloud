import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { WorkspaceEntity } from '@nx-cloud/api/db/entities';

@Module({
  imports: [
    MikroOrmModule.forFeature([WorkspaceEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  providers: [JwtStrategy],
})
export class ApiAuthModule {}
