import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export enum TokenPermission {
  ReadCache = 'read:cache',
  WriteCache = 'write:cache',
}

export const TokenPermissions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TokenPermission[] => {
    return ctx.switchToHttp().getRequest().user?.permissions ?? [];
  }
);
