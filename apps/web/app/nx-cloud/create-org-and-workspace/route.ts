import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import * as process from 'node:process';

export async function POST(request: Request) {
  const body = await request.json();
  const { workspaceName, installationSource } = body;

  const prisma = new PrismaClient();

  const workspace = await prisma.workspaceEntity.create({
    data: {
      name: workspaceName,
    },
  });

  return Response.json({
    url: 'http://localhost:3333',
    token: jwt.sign(
      {
        workspaceId: workspace.id,
        permissions: ['read:cache', 'write:cache'],
      },
      process.env.JWT_SECRET!
    ),
  });
}
