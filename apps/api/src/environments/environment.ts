import { ReflectMetadataProvider } from '@mikro-orm/core';
import {
  ExecutionEntity,
  TaskEntity,
  WorkspaceEntity,
} from '@nx-cloud/api/db/entities';
import * as process from 'process';

export const environment = {
  production: false,
  mikroOrm: {
    type: 'postgresql' as const,
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    dbName: process.env.POSTGRES_DB || 'nx_cloud',
    password: process.env.POSTGRES_PASSWORD || null,
    user: process.env.POSTGRESS_USER || null,
    metadataProvider: ReflectMetadataProvider,
    entities: [WorkspaceEntity, TaskEntity, ExecutionEntity],
  },
};
