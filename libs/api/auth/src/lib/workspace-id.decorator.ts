import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WorkspaceId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    return ctx.switchToHttp().getRequest().user?.workspaceId;
  }
);
